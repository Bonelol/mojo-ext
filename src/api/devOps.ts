import axios from 'axios';

import { devOpsHost } from '@config/index';
import { PromiseReturn } from './types';
import { Projects, Project, WorkItemTypes, ClassificationNodes, AttachmentUploadResponse, WorkItemResponse } from '@store/item/types';

export const getProjects = async (token: string): PromiseReturn<Projects> =>
    axios({
        url: `${devOpsHost()}/_apis/projects?api-version=5.1`,
        method: 'get',
        headers:  { Authorization: `Bearer ${token}`, Accept: 'application/json' }
    });

export const getProject = async (projectName: string, token: string): PromiseReturn<Project> => 
    axios({
        url: `${devOpsHost()}/_apis/projects/${projectName}?api-version=5.1`,
        method: 'get',
        headers:  { Authorization: `Bearer ${token}`, Accept: 'application/json' }
    });

export const getWorkItemTypes = async (ProjectName: string, token: string): PromiseReturn<WorkItemTypes> => 
    axios({
        url: `${devOpsHost()}/${ProjectName}/_apis/wit/workitemtypes?api-version=5.1`,
        method: 'get',
        headers:  { Authorization: `Bearer ${token}`, Accept: 'application/json' }
    });

export const getWorkItemTypeFields = async (ProjectName: string, workItem: string, token: string): PromiseReturn<WorkItemTypes> => 
    axios({
        url: `${devOpsHost()}/${ProjectName}/_apis/wit/workitemtypes/${workItem}?$expand=all&api-version=5.1`,
        method: 'get',
        headers:  { Authorization: `Bearer ${token}`, Accept: 'application/json' }
    });

export const getClassificationNodes = async (ProjectName: string, token: string): PromiseReturn<ClassificationNodes> => 
    axios({
        url: `${devOpsHost()}/${ProjectName}/_apis/wit/classificationnodes?$depth=15&api-version=5.1`,
        method: 'get',
        headers:  { Authorization: `Bearer ${token}`, Accept: 'application/json' }
    });

export const postWorkItem = async (ProjectName: string, workItemType: string, data: any[], token: string): PromiseReturn<WorkItemResponse> => 
    axios({
        url: `${devOpsHost()}/${ProjectName}/_apis/wit/workitems/$${workItemType}?api-version=5.1`,
        method: 'post',
        headers:  { Authorization: `Bearer ${token}`, Accept: 'application/json', 'Content-Type': 'application/json-patch+json'},
        data: data
    });

export const postAttachment = async (fileName: string, data: ArrayBuffer | Blob, token: string): PromiseReturn<AttachmentUploadResponse> => 
    axios({
        url: `${devOpsHost()}/_apis/wit/attachments?fileName=${fileName}&api-version=5.1`,
        method: 'post',
        headers:  { Authorization: `Bearer ${token}`, Accept: 'application/json', 'Content-Type': 'application/octet-stream'},
        data: data
    });

export const postComment = async (ProjectName: string, workItemId: number, comment: string, token: string): PromiseReturn<WorkItemResponse> => 
    axios({
        url: `${devOpsHost()}/${ProjectName}/_apis/wit/workItems/${workItemId}/comments?api-version=5.1-preview.3`,
        method: 'post',
        headers:  { Authorization: `Bearer ${token}`, Accept: 'application/json', 'Content-Type': 'application/json'},
        data: { 'text' : comment }
    });

export const updateWorkItem = async (ProjectName: string, workItemId: number, values: any[], token: string): PromiseReturn<WorkItemResponse> => 
    axios({
        url: `${devOpsHost()}/${ProjectName}/_apis/wit/workItems/${workItemId}?api-version=5.1`,
        method: 'patch',
        headers:  { Authorization: `Bearer ${token}`, Accept: 'application/json', 'Content-Type': 'application/json-patch+json'},
        data: values
    });