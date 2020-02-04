import { PluginOptions as GatsbyPluginOptions, NodeInput } from 'gatsby'
import { Document as PrismicDocument } from 'prismic-javascript/d.ts/documents'
import * as PrismicDOM from 'prismic-dom'

export type NodeID = string

export interface DocumentNodeInput extends NodeInput {
  prismicId: PrismicDocument['id']
  data: { [key: string]: NormalizedField }
  dataString: string
  dataRaw: PrismicDocument['data']
  alternate_languages: NormalizedAlternateLanguagesField
  url: string
}

export interface SliceNodeInput extends NodeInput {
  primary: { [key: string]: NormalizedField }
  items: { [key: string]: NormalizedField }[]
}

export interface TypePath {
  path: string[]
  type: GraphQLType | string
}

export type FieldNormalizer<T, N> = (
  apiId: string,
  field: T,
  path: TypePath['path'],
  doc: PrismicDocument,
  env: DocumentsToNodesEnvironment,
) => N

export type ImageFieldNormalizer = FieldNormalizer<
  ImageField,
  NormalizedImageField
>

export type LinkFieldNormalizer = FieldNormalizer<
  LinkField,
  NormalizedLinkField
>

export type SlicesFieldNormalizer = FieldNormalizer<
  SliceIDsField,
  NormalizedSlicesField
>

export type StructuredTextFieldNormalizer = FieldNormalizer<
  StructuredTextField,
  NormalizedStructuredTextField
>

export type Field =
  | StructuredTextField
  | ImageField
  | SlicesField
  | GroupField
  | LinkField
  | AlternateLanguagesField
  | string
  | number
  | boolean
  | null

export type NormalizedField =
  | NormalizedStructuredTextField
  | NormalizedImageField
  | NormalizedSlicesField
  | NormalizedGroupField
  | NormalizedLinkField
  | NormalizedAlternateLanguagesField
  | Field

export type StructuredTextField = {
  type: string
  text: string
  spans: { [key: string]: unknown }
}[]

export interface NormalizedStructuredTextField {
  html: string
  text: string
  raw: StructuredTextField
}

export type SlicesField = Slice[]

interface Slice {
  slice_type: string
  slice_label: string | null
  items: { [key: string]: Field }[]
  primary: { [key: string]: Field }
}

export type SliceIDsField = NodeID[]

export type NormalizedSlicesField = NodeID[]

export enum LinkFieldType {
  Any = 'Any',
  Document = 'Document',
  Media = 'Media',
  Web = 'Web',
}

export interface LinkField {
  link_type: LinkFieldType
  isBroken: boolean
  url?: string
  target?: string
  size?: number
  id?: string
  type?: string
  tags?: string[]
  lang?: string
  slug?: string
  uid?: string
}

export interface NormalizedLinkField extends LinkField {
  url: string
  document?: NodeID
  raw: LinkField
}

interface ImageThumbnailField {
  alt?: string
  copyright?: string
  dimensions?: { width: number; height: number }
  url?: string
}

export interface ImageField {
  alt?: string
  copyright?: string
  dimensions?: { width: number; height: number }
  url?: string
  thumbnails: ImageThumbnailField
}

export interface NormalizedImageField extends ImageField {
  localFile?: NodeID
}

export type AlternateLanguagesField = LinkField[]

export type NormalizedAlternateLanguagesField = AlternateLanguagesField

export type GroupField = { [key: string]: Field }[]

export type NormalizedGroupField = { [key: string]: NormalizedField }[]

export interface DocumentsToNodesEnvironment {
  createNode: (node: NodeInput) => void
  createNodeId: (input: unknown) => string
  createContentDigest: (input: unknown) => string
  normalizeImageField: ImageFieldNormalizer
  normalizeLinkField: LinkFieldNormalizer
  normalizeSlicesField: SlicesFieldNormalizer
  normalizeStructuredTextField: StructuredTextFieldNormalizer
  typePaths: TypePath[]
  pluginOptions: PluginOptions
}

export enum FieldType {
  Color = 'Color',
  Date = 'Date',
  Embed = 'Embed',
  GeoPoint = 'GeoPoint',
  Group = 'Group',
  Image = 'Image',
  Link = 'Link',
  Number = 'Number',
  Select = 'Select',
  Slice = 'Slice',
  Slices = 'Slices',
  StructuredText = 'StructuredText',
  Text = 'Text',
  Timestamp = 'Timestamp',
  UID = 'UID',
  // Internal plugin-specific field not defined in the in Prismic schema.
  AlternateLanguages = 'AlternateLanguages',
}

export enum GraphQLType {
  ID = 'ID',
  String = 'String',
  Float = 'Float',
  Date = 'Date',
  JSON = 'JSON',
  Link = 'PrismicLinkType',
  Image = 'PrismicImageType',
  ImageThumbnail = 'PrismicImageThumbnailType',
  ImageThumbnails = 'PrismicImageThumbnailsType',
  Embed = 'PrismicEmbedType',
  GeoPoint = 'PrismicGeoPointType',
  StructuredText = 'PrismicStructuredTextType',
  AllDocumentTypes = 'PrismicAllDocumentTypes',
  Group = 'Group',
  Slices = 'Slices',
  AlternateLanguages = 'AlternateLanguages',
}

export enum SliceChoiceDisplay {
  List = 'list',
  Grid = 'grid',
}

interface BaseFieldConfigSchema {
  label?: string
  labels?: { [key: string]: string[] }
  placeholder?: string
  [key: string]: unknown
}

export interface BaseFieldSchema {
  type: FieldType
  config: BaseFieldConfigSchema
}

export interface ImageFieldSchema extends BaseFieldSchema {
  type: FieldType.Image
  config: ImageFieldConfigSchema
}

interface ThumbnailSchema {
  name: string
  width?: string
  height?: string
}

interface ImageFieldConfigSchema extends BaseFieldConfigSchema {
  constraint?: { width?: number; height?: number }
  thumbnails?: ThumbnailSchema[]
}

export interface SlicesFieldSchema extends BaseFieldSchema {
  type: FieldType.Slices
  fieldset: string
  config: SlicesFieldConfigSchema
}

interface SlicesFieldConfigSchema extends BaseFieldConfigSchema {
  choices: SliceChoicesSchema
}

export interface SliceChoicesSchema {
  [sliceId: string]: SliceFieldSchema
}

export interface SliceFieldSchema extends BaseFieldSchema {
  type: FieldType.Slice
  fieldset: string
  description: string
  icon: string
  display: SliceChoiceDisplay
  repeat?: FieldsSchema
  'non-repeat'?: FieldsSchema
}

export interface GroupFieldSchema extends BaseFieldSchema {
  type: FieldType.Group
  config: GroupFieldConfigSchema
}

interface GroupFieldConfigSchema extends BaseFieldConfigSchema {
  fields: FieldsSchema
}

export type FieldSchema =
  | BaseFieldSchema
  | ImageFieldSchema
  | SlicesFieldSchema
  | GroupFieldSchema
  | SliceFieldSchema

export interface FieldsSchema {
  [fieldId: string]: FieldSchema
}

export interface TabSchema {
  [fieldId: string]: FieldSchema
}

export interface Schema {
  [tabName: string]: TabSchema
}

export interface Schemas {
  [schemaId: string]: Schema
}

export type LinkResolver = (doc: object) => string
type PluginLinkResolver = (input: {
  key?: string
  value?: unknown
  node: PrismicDocument
}) => LinkResolver

export type HTMLSerializer = typeof PrismicDOM.HTMLSerializer
type PluginHTMLSerializer = (input: {
  key: string
  value: unknown
  node: PrismicDocument
}) => HTMLSerializer

export interface PluginOptions extends GatsbyPluginOptions {
  repositoryName: string
  accessToken?: string
  linkResolver?: PluginLinkResolver
  htmlSerializer?: PluginHTMLSerializer
  fetchLinks?: string[]
  schemas: Schemas
  lang?: string
  shouldDownloadImage?: unknown
  shouldNormalizeImage?: unknown
  typePathsFilenamePrefix?: string
}