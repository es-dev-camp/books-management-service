import Vue, { VNode } from 'vue';

declare global {
  namespace JSX {
    // @ts-ignore tslint:disable no-empty-interface
    interface Element extends VNode {}
    // tslint:disable no-empty-interface
    interface ElementClass extends Vue {}
    interface IntrinsicElements {
      [elem: string]: any;
    }
  }
}
