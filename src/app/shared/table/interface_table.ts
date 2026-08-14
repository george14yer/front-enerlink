export interface TableColumn {

  field: string;
  header: string;
  type?: 'text' | 'date' | 'boolean';
  format?: string;

}