/**
 *
 * DevOps
 *
 */

import React, { useState, useEffect, useMemo } from 'react';
import { useHistory, Redirect } from 'react-router';
import { getClient } from "azure-devops-extension-api";
import { CoreRestClient, ProjectVisibility, TeamProjectReference } from "azure-devops-extension-api/Core";
import { PeoplePickerProvider } from "azure-devops-extension-api/Identities";
import { WorkItemTrackingRestClient, WorkItemTrackingServiceIds, WorkItemTypeReference } from "azure-devops-extension-api/WorkItemTracking";
import {
  IdentityPickerDropdown,
  IIdentity,
} from "azure-devops-ui/IdentityPicker";
import { Props } from 'src/types';
import './index.scss';
import { Select, Card, Spin } from 'antd';
import useLocalStorage from '@hooks/useLocalStorage';
import { useState as useMojoUserState } from '@store/mojoUser';
import { useState as useTicketState } from '@store/ticket';
import {
  getProjects,
  getWorkItemTypes,
  getClassificationNodes,
  postWorkItem,
  postComment,
  postAttachment,
  updateWorkItem
} from '@api/devOps';
import {
  Project,
  WorkItemType,
  ClassificationNode,
  WorkItemTypeField
} from '@store/item/types';
import ContentEditor from '@components/ContentEditor';
import { mojoEndpoint, devOpsHost } from '@config/index';
import runSeq from '@utils/runSeq ';
import { getAttachment, postStaffNote } from '@api/mojo';
import OptionalFields, { OptionalFieldValue } from './OptionalFields';
import { getAccessToken } from 'azure-devops-extension-sdk';

export type Field = Project | WorkItemType | ClassificationNode | WorkItemTypeField;

const DevOps = (props: Props) => {
  const { event } = props;
  const history = useHistory();
  const [spinning, setSpinning] = useState(false);

  useEffect(() => {
    event?.subscribe('DevOps', (event: string) => {
      if (event === 'create' && azureToken) {
        const workItem = createWorkItem();
        setSpinning(true);

        postWorkItem(
          projectName,
          workItemTypeName,
          workItem,
          azureToken
        )
          .then(r => runSeq(updateComments(r.data.id)).then(_ => Promise.resolve(r.data)))
          .then(data => updateAttachments(data.id).catch(e => Promise.resolve(data)).then(_ => Promise.resolve(data)))
          //.then(data => postStaffNote(ticket.id, `See <a>${devOpsHost()}/${projectName}/_workitems/edit/${data.id}</a>`, mojoToken).then(_ => Promise.resolve(data)))
          .then(data => history.push('/final', data));
      }
    })

    return () => {
      event?.unsubscribe('DevOps');
    }
  })

  const tickets = useTicketState();
  const ticket = tickets[0];

  if (!ticket) {
    return <Redirect to="/mojo"></Redirect>;
  }

  const [defaultValues, setDefaultValues] = useLocalStorage('default', {});
  const [mojoToken] = useLocalStorage('mojoToken', '');
  const [azureToken, setAzureToken] = useState('');
  const [optionalFields] = useLocalStorage('optionalFields', []);
  const [projects, setProjects] = useState([] as TeamProjectReference[]);
  const [workItemTypes, setWorkItemTypes] = useState([] as WorkItemType[]);
  const [classificationNodes, setClassificationNodes] = useState<ClassificationNode[]>([]);
  const [area, setArea] = useState('');
  const [iteration, setIteration] = useState('');
  const [projectName, setProjectName] = useState(defaultValues.projectName);
  const [workItemTypeName, setWorkItemTypeName] = useState(defaultValues.workItemTypeName);
  const [optionalFieldValues, setOptionalFieldValues] = useState<OptionalFieldValue[]>([]);
  const [comment, setComment] = useState(`See <a>${mojoEndpoint()}/ma/#/tickets/${ticket.id}</a>`);
  const [staffNote, setStaffNote] = useState(`See <a>${devOpsHost()}/${projectName}/_workitems/edit/${ticket.id}</a>`);
  const users = useMojoUserState();
  const [identity, setIdentity] = useState<IIdentity>();
  const [peoplePickerProvider] = useState(new PeoplePickerProvider())
  const [runOnce] = useState(true);

  useEffect(() => {
    getClient(CoreRestClient).getProjects().then(projects => {
      setProjects(projects);

      if(!projects.find(v => v.name === defaultValues.projectName)) {
        setProjectName('');
        setDefaultValues({...defaultValues, projectName: '', workItemTypeName: ''})
      } else {
        setProjectName(defaultValues.projectName);
      }
    });

    getAccessToken().then((accessToken => setAzureToken(accessToken)));
  }, [runOnce])  

  const handleProjectSelected = (value: string) => {
    setProjectName(value);
  };

  useEffect(() => {
    setDefaultValues({...defaultValues, projectName});

    if(!projectName || projects.every(p => p.name !== projectName)) {
      setWorkItemTypes([])
      setClassificationNodes([]);
      return;
    }

    getClient(WorkItemTrackingRestClient)
    .getWorkItemTypes(projectName)
    .then(workItemTypes => {
      setWorkItemTypes(workItemTypes);

      if(!workItemTypes.find(v => v.name === defaultValues.workItemTypeName)) {
        setWorkItemTypeName('');
        setDefaultValues({...defaultValues, projectName, workItemTypeName: ''})
      } else {
        setWorkItemTypeName(defaultValues.workItemTypeName);
      }
    });

    // getClassificationNodes(projectName, azureToken).then(response => {
    //   setClassificationNodes(response.data.value);
    // });
  }, [projectName, projects])

  const handleWorkItemTypeSelected = (workItemTypeName: string) => {
    setWorkItemTypeName(workItemTypeName);
  };

  useEffect(() => {
    setDefaultValues({...defaultValues, workItemTypeName});

    const workItemType = workItemTypes.find(t => t.name === workItemTypeName);
    setOptionalFieldValues((workItemType?.fields || []).filter(f => optionalFields.includes(f.name)).map(f => ({
      name: f.name, 
      referenceName: f.referenceName, 
      value: f.defaultValue
    })))
  }, [workItemTypeName, workItemTypes])

  const handleclassificationNodeSelected = (node: ClassificationNode) => {
    return (value: string) => {
      node.structureType === 'area' ? setArea(value) : setIteration(value);
    };
  };

  const getDefaultValue = (defaultValue: string, options: Field[]) => {
    return options.some(o => o.name === defaultValue) ? defaultValue : '';
  }

  const createWorkItem = () => {
    const data = [];

    if (ticket.title) {
      data.push({
        op: 'add',
        path: '/fields/System.Title',
        value: ticket.title
      });
    }

    if (ticket.description) {
      data.push({
        op: 'add',
        path: '/fields/System.Description',
        value: ticket.description
      });
    }

    if (area) {
      data.push({
        op: 'add',
        path: '/fields/System.AreaPath',
        value: area
      });
    }

    if (iteration) {
      data.push({
        op: 'add',
        path: '/fields/System.IterationPath',
        value: iteration
      });
    }

    if (identity) {
      data.push({
        op: 'add',
        path: '/fields/System.AssignedTo',
        value: identity
      });
    }

    data.push({
      op: 'add',
      path: '/fields/Microsoft.VSTS.Common.Activity',
      value: 'Development'
    });

    const optional = optionalFieldValues.filter(v => v.value).map(v => ({
      op: 'add',
      path: `/fields/${v.referenceName}`,
      value: v.value
    }))

    return data.concat(optional);
  };

  const classificationNodeListView = useMemo(
    () => (
      <>
        {(classificationNodes || []).map(node => (
          <div key={node.structureType} className="classification-node">
            <label className='mojo-label'>{node.structureType}</label>
            <Select
              defaultValue={getDefaultValue(defaultValues[node.name], [node, ...(node.children || [])])}
              style={{ width: '100%' }}
              placeholder={`Please select ${node.structureType}`}
              showSearch={true}
              onChange={handleclassificationNodeSelected(node)}
            >
              {[
                <Select.Option key={node.name} value={node.name}>
                  {node.name}
                </Select.Option>
              ].concat(
                (node.children || []).map(cn => (
                  <Select.Option key={cn.name} value={cn.name}>
                    {cn.name}
                  </Select.Option>
                ))
              )}
            </Select>
          </div>
        ))}
      </>
    ),
    [classificationNodes]
  );

  const handleCommentChange = (value: string) => {
    setComment(value);
  };

  const handleOptionalChange = (value: OptionalFieldValue[]) => {
    setOptionalFieldValues(value);
  }

  const updateComments = (id: number) => {
    const comments = (ticket.comments || []).map(
      c => {
        const user = users.find(u => u.id === c.user_id);
        const username = user ? `${user.first_name} ${user.last_name}` : 'Unknown';

        return `Posted by: ${username}, on ${c.updated_on || c.created_on} 
        <br />
        ${c.body.replace(new RegExp('\r?\n', 'g'),'<br />')}`
      }        
    );
    return [...comments, comment].map(c => () =>
      postComment(projectName, id, c, azureToken)
    );
  };

  const updateAttachments = (id: number) => {
    const attachments = (ticket.attachments || []).map(a =>
      getAttachment(a.id, mojoToken).then(r =>
        postAttachment(a.filename, r.data, azureToken)
      )
    );

    console.log(attachments);

    if(attachments.length === 0) {
      return Promise.resolve({});
    }

    return Promise.all(attachments).then(responses => {
      const request = responses.map(r => ({
        op: 'add',
        path: '/relations/-',
        value: {
          rel: 'AttachedFile',
          url: r.data.url
        }
      }));

      return updateWorkItem(projectName, id, request, azureToken);
    });
  };

  const identityChange = (identity: IIdentity | undefined) => {
    setIdentity(identity)
  }

  return (
    <Spin tip="Creating..." spinning={spinning}>
      <div className="devOps">
        <Card title="Assigned To">
          <IdentityPickerDropdown 
            onChange={identityChange}
            pickerProvider={peoplePickerProvider}
            value={identity}/>
        </Card>
        <Card title="Required Fields">
          <div className="devOps-row">
            <div>
              <label className='mojo-label'>Project</label>
              <Select
                value={projectName}
                style={{ width: '100%' }}
                placeholder="Please select project"
                showSearch={true}
                onChange={handleProjectSelected}
              >
                {(projects || []).map(p => (
                  <Select.Option key={p.name} value={p.name}>
                    {p.name}
                  </Select.Option>
                ))}
              </Select>
            </div>
            <div>
              <label className='mojo-label'>Work Item Type</label>
              <Select
                value={workItemTypeName}
                style={{ width: '100%' }}
                placeholder="Please select work item type"
                showSearch={true}
                onChange={handleWorkItemTypeSelected}
              >
                {(workItemTypes || []).map(p => (
                  <Select.Option key={p.name} value={p.name}>
                    {p.name}
                  </Select.Option>
                ))}
              </Select>
            </div>
          </div>
        </Card>
        {optionalFieldValues && optionalFieldValues.length > 0 ?
          <Card title="Optional Fields" className='optional-fields'>
            <div className='devOps-row'>
              <OptionalFields value={optionalFieldValues} onChange={handleOptionalChange}/>
            </div>
          </Card> 
          : null}
        <Card title="Comment">
          <ContentEditor content={comment} onChange={handleCommentChange} />
        </Card>
      </div>
    </Spin>
  );
};

export default DevOps;
