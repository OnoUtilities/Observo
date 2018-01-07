import "Observo.Content.Element"



export class Box extends Observo.Content.Element {
    constructor() {
        super()
        this.createElement("md-box")
    }
    onCreate(shadow) {
        let template = `
        <style>
            :host([row]) {
                display: -webkit-box;
                display: -ms-flexbox;
                display: -webkit-flex;
                display: flex;
                -webkit-box-direction: normal ;
                -webkit-box-orient: horizontal;
                -webkit-flex-direction: row;
                -ms-flex-direction: row;
                flex-direction: row;
                -webkit-flex-wrap: nowrap;
                -ms-flex-wrap: nowrap;
                flex-wrap: nowrap;
                -webkit-box-pack: start;
                -webkit-justify-content: flex-start;
                -ms-flex-pack: start;
                justify-content: flex-start;
                -webkit-align-content: stretch;
                -ms-flex-line-pack: stretch;
                align-content: stretch;
                -webkit-box-align: stretch;
                -webkit-align-items: stretch;
                -ms-flex-align: stretch;
                align-items: stretch;
            }
            :host([row-center]) {
                display: flex; 
                flex-flow: row; 
                justify-content:center;
            }
             :host([column]) {
                display: -webkit-box;
                display: -ms-flexbox;
                display: -webkit-flex;
                display: flex;
                -webkit-box-direction: normal;
                -webkit-box-orient: horizontal;
                -webkit-flex-direction: row;
                -ms-flex-direction: row;
                flex-direction: row;
                -webkit-flex-wrap: nowrap;
                -ms-flex-wrap: nowrap;
                flex-wrap: nowrap;
                -webkit-box-pack: start;
                -webkit-justify-content: flex-start;
                -ms-flex-pack: start;
                justify-content: flex-start;
                -webkit-align-content: stretch;
                -ms-flex-line-pack: stretch;
                align-content: stretch;
                -webkit-box-align: stretch;
                -webkit-align-items: stretch;
                -ms-flex-align: stretch;
                align-items: stretch;
                -webkit-box-orient: vertical;
                -webkit-flex-direction: column;
                -ms-flex-direction: column;
                flex-direction: column;
            }
            :host([column-center]) {
                display: flex; 
                flex-flow: column; 
                justify-content:center;
            }
            :host([flex]) {
                -webkit-box-flex: 1;
                -webkit-flex: 1;
                flex: 1;
                -webkit-align-self: auto;
                align-self: auto;
            }
        </style>
            <slot></slot>
   `
   shadow.innerHTML = template
    }
}