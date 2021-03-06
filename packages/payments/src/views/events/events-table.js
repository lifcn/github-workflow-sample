import ElasticProcessor from '@lib/processors/elastic-processor'


const TABLE_FILTERS = [
  {
    attribute: 'occurredAt',
    label: 'Date Created',
    type: 'date',
    icon: 'el-icon-date',
  },
  {
    attribute: 'description',
    type: 'string',
    icon: 'el-icon-data-board',
  },
  {
    attribute: 'id',
    label: 'ID',
    type: 'string',
    icon: 'el-icon-document',
  },
]

const TABLE_COLUMNS = [
  {
    name: 'occurredAt',
    label: 'Date Created',
    icon: 'el-icon-date',
    format: 'dateTime',
    width: 160,
  },
  {
    name: 'description',
    label: 'Description',
    icon: 'el-icon-data-board',
    width: 400,
  },
  {
    name: 'id',
    label: 'ID',
    icon: 'el-icon-document',
    width: 180,
  },
]

export default function(component){
  return {
    processor: new ElasticProcessor({
      component,
      index: 'activities'
    }),
    filters: TABLE_FILTERS,
    columns: TABLE_COLUMNS,
  }
}
