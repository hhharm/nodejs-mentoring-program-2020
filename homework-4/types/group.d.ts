
export type Permission = 'READ' | 'WRITE' | 'DELETE' | 'SHARE' | 'UPLOAD_FILES';

export type Group = {
    id: string;
    name: string;
    permissions: Array<Permission>;
}
export interface GroupCreation extends Optional<IGroup, "id"> {}

export type GroupResponse =
  | Group
  | Array<Group>
  | {
      message: string;
      errors?: string[];
    };
