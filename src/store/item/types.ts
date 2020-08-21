export type Reducer = (state: State, action: Action) => State;

export interface Item {
  name: string;
  id: number;
}

export interface Projects {
  count: number;
  value: Project[]
}

export interface Project {
  id: string;
  name: string;
  url: string;
  selected?: boolean;
  workItemTypes: [];
}

export interface Attachement {
  id: string,
  name: string,
  selected?: boolean
}

export interface FieldDefinition {
  id: number,
  name: string,
  referenceName: string,
  rules: Map<string, string|boolean|Array<string>>,
  type: number,
}

export interface WorkItemType {
  color: string;
  description: string;
  fieldInstances: WorkItemTypeFieldInstance[];
  fields: WorkItemTypeField[];
  icon: WorkItemIcon
  isDisabled: boolean
  name: string
  referenceName: string
  states: WorkItemStateColor[]
  url: string
}

export interface WorkItemTypes {
  count: number;
  value: WorkItemType[];
}

export interface WorkItemIcon {

}

export interface WorkItemTypeFields {
  count: number;
  value: WorkItemType[];
}

export interface WorkItemTypeField {
  helpText: string;
  alwaysRequired: boolean;
  defaultValue: string;
  allowedValues: any[];
  dependentFields: any[];
  referenceName: string;
  name: string;
  url: string;
}

export interface WorkItemTypeFieldInstance {
  
}

export interface WorkItemStateColor {
  
}

export interface Identity {
  entityId: string
  entityType: string
  originDirectory: string
  origin: string;
  originId: string
  localDirectory: string
  localId: string
  metaType: string;
  displayName: string
  scopeName: string
  samAccountName: string
  principalName: string;
  active: boolean
  subjectDescriptor: string
  department: string
  jobTitle: string
  mail: string
  mailNickname: string
  physicalDeliveryOfficeName: string
  signInAddress: string
  surname: string
  guest: boolean
  telephoneNumber: string
  description: string
  isMru: boolean
}

export interface Identities {
  count: number;
  value: Identity[];
}

export interface ClassificationNode {
  id: number;
  identifier: string;
  name: string;
  structureType: 'area' | 'iteration'
  hasChildren: boolean;
  path: string;
  children?: ClassificationNode[];
}

export interface ClassificationNodes {
  count: number;
  value: ClassificationNode[];
}

export interface WorkItemResponse {
  id: number;
  url: string;
  _links: {
    html: {
      href: string;
    };
  };  
}

export interface AttachmentUploadResponse {
  id: string;
  url: string;
}

export type State = Item[];

export type Action =
  | { type: 'ITEM_INIT'; payload: Item[] }
  | { type: 'ITEM_FETCH'; payload: Item[] }
  | { type: 'ITEM_ADD'; payload: Item };