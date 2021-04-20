// Get json https://www.googleapis.com/books/v1/volumes?q=isbn:1234567890123
// Generate .ts using http://www.json2ts.com/
export type IndustryIdentifier = {
  // 主に ISBN_10, ISBN_13 の種類
  type: string;
  identifier: string;
};

export type ReadingModes = {
  text: boolean;
  image: boolean;
};

export type PanelizationSummary = {
  containsEpubBubbles: boolean;
  containsImageBubbles: boolean;
};

export type ImageLinks = {
  extraLarge: string;
  large: string;
  medium: string;
  small: string;
  smallThumbnail: string;
  thumbnail: string;
};

export type VolumeInfo = {
  title: string;
  subtitle: string;
  authors: string[];
  publisher: string;
  publishedDate: string;
  description: string;
  industryIdentifiers: IndustryIdentifier[];
  readingModes: ReadingModes;
  pageCount: number;
  printType: string;
  printedPageCount: number;
  maturityRating: string;
  allowAnonLogging: boolean;
  contentVersion: string;
  panelizationSummary: PanelizationSummary;
  imageLinks: ImageLinks;
  language: string;
  previewLink: string;
  infoLink: string;
  canonicalVolumeLink: string;
};

export type SaleInfo = {
  country: string;
  saleability: string;
  isEbook: boolean;
};

export type Epub = {
  isAvailable: boolean;
};

export type Pdf = {
  isAvailable: boolean;
};

export type AccessInfo = {
  country: string;
  viewability: string;
  embeddable: boolean;
  publicDomain: boolean;
  textToSpeechPermission: string;
  epub: Epub;
  pdf: Pdf;
  webReaderLink: string;
  accessViewStatus: string;
  quoteSharingAllowed: boolean;
};

export type Item = {
  kind: string;
  id: string;
  etag: string;
  selfLink: string;
  volumeInfo: VolumeInfo;
  saleInfo: SaleInfo;
  accessInfo: AccessInfo;
};

export type IGoogleBookInfo = {
  kind: string;
  totalItems: number;
  items: Item[];
};
