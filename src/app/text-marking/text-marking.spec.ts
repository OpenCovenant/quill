import {TestBed} from '@angular/core/testing';
import {AppComponent} from '../app.component';
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {TextMarking} from "../models/TextMarking";
import {markText} from "./text-marking";

describe('Marker', () => {
    const EDITOR_ID = "editor";

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [
                AppComponent
            ], imports: [
                HttpClientTestingModule
            ]
        }).compileComponents();
    });

    it(`mark the typo`, () => {
        const html = 'asd';
        const editor = document.createElement('div');
        editor.id = EDITOR_ID;
        editor.innerHTML = html;

        const markings: TextMarking[] = [{
            from: 0,
            to: 3,
            type: "typo",
            subtype: "",
            description: "",
            suggestions: [{display: '', action: ''}]
        }];

        markText(editor, markings);

        const expectedHMTL = '<span class="typo">asd</span>';
        const expectedEditor = document.createElement('div');
        expectedEditor.id = EDITOR_ID;
        expectedEditor.innerHTML = expectedHMTL;

        expect(editor).toEqual(expectedEditor);
    });

    it(`mark the typo preceded by a non-marking`, () => {
        const html = 'pra asd';
        const editor = document.createElement('div');
        editor.id = EDITOR_ID;
        editor.innerHTML = html;

        const markings: TextMarking[] = [{
            from: 4,
            to: 7,
            type: "typo",
            subtype: "",
            description: "",
            suggestions: [{display: '', action: ''}]
        }];

        markText(editor, markings);

        const expectedHMTL = 'pra <span class="typo">asd</span>';
        const expectedEditor = document.createElement('div');
        expectedEditor.id = EDITOR_ID;
        expectedEditor.innerHTML = expectedHMTL;

        expect(editor).toEqual(expectedEditor);
    });

    it(`mark the typo succeeded by a non-marking`, () => {
        const html = 'asd kaq';
        const editor = document.createElement('div');
        editor.id = EDITOR_ID;
        editor.innerHTML = html;

        const markings: TextMarking[] = [{
            from: 0,
            to: 3,
            type: "typo",
            subtype: "",
            description: "",
            suggestions: [{display: '', action: ''}]
        }];

        markText(editor, markings);

        const expectedHMTL = '<span class="typo">asd</span> kaq';
        const expectedEditor = document.createElement('div');
        expectedEditor.id = EDITOR_ID;
        expectedEditor.innerHTML = expectedHMTL;

        expect(editor).toEqual(expectedEditor);
    });

    it(`mark the stylistic`, () => {
        const html = 'asd kaq';
        const editor = document.createElement('div');
        editor.id = EDITOR_ID;
        editor.innerHTML = html;

        const markings: TextMarking[] = [{
            from: 0,
            to: 3,
            type: "stylistic",
            subtype: "",
            description: "",
            suggestions: [{display: '', action: ''}]
        }];

        markText(editor, markings);

        const expectedHMTL = '<span class="stylistic">asd</span> kaq';
        const expectedEditor = document.createElement('div');
        expectedEditor.id = EDITOR_ID;
        expectedEditor.innerHTML = expectedHMTL;

        expect(editor).toEqual(expectedEditor);
    });

    it(`mark the loanword`, () => {
        const html = 'asd kaq';
        const editor = document.createElement('div');
        editor.id = EDITOR_ID;
        editor.innerHTML = html;

        const markings: TextMarking[] = [{
            from: 0,
            to: 3,
            type: "loanword",
            subtype: "",
            description: "",
            suggestions: [{display: '', action: ''}]
        }];

        markText(editor, markings);

        const expectedHMTL = '<span class="loanword">asd</span> kaq';
        const expectedEditor = document.createElement('div');
        expectedEditor.id = EDITOR_ID;
        expectedEditor.innerHTML = expectedHMTL;

        expect(editor).toEqual(expectedEditor);
    });

    it(`mark both consequent typos separated by a space`, () => {
        const html = 'asd kli';
        const editor = document.createElement('div');
        editor.id = EDITOR_ID;
        editor.innerHTML = html;

        const markings: TextMarking[] = [{
            from: 0,
            to: 3,
            type: "typo",
            subtype: "",
            description: "",
            suggestions: [{display: '', action: ''}]
        }, {
            from: 4,
            to: 7,
            type: "typo",
            subtype: "",
            description: "",
            suggestions: [{display: '', action: ''}]
        }];

        markText(editor, markings);

        const expectedHMTL = '<span class="typo">asd</span> <span class="typo">kli</span>';
        const expectedEditor = document.createElement('div');
        expectedEditor.id = EDITOR_ID;
        expectedEditor.innerHTML = expectedHMTL;

        expect(editor).toEqual(expectedEditor);
    });

    it(`mark the loanword and stylistic`, () => {
        const html = 'asd kli';
        const editor = document.createElement('div');
        editor.id = EDITOR_ID;
        editor.innerHTML = html;

        const markings: TextMarking[] = [{
            from: 0,
            to: 3,
            type: "loanword",
            subtype: "",
            description: "",
            suggestions: [{display: '', action: ''}]
        }, {
            from: 4,
            to: 7,
            type: "stylistic",
            subtype: "",
            description: "",
            suggestions: [{display: '', action: ''}]
        }];

        markText(editor, markings);

        const expectedHMTL = '<span class="loanword">asd</span> <span class="stylistic">kli</span>';
        const expectedEditor = document.createElement('div');
        expectedEditor.id = EDITOR_ID;
        expectedEditor.innerHTML = expectedHMTL;

        expect(editor).toEqual(expectedEditor);
    });

    it(`mark the typo within the stylistic`, () => {
        const html = 'asd kli ghj';
        const editor = document.createElement('div');
        editor.id = EDITOR_ID;
        editor.innerHTML = html;

        const markings: TextMarking[] = [{
            from: 0,
            to: 11,
            type: "stylistic",
            subtype: "",
            description: "",
            suggestions: [{display: '', action: ''}]
        }, {
            from: 4,
            to: 7,
            type: "typo",
            subtype: "",
            description: "",
            suggestions: [{display: '', action: ''}]
        }];

        markText(editor, markings);

        const expectedHMTL = '<span class="stylistic">asd <span class="typo">kli</span> ghj</span>';
        const expectedEditor = document.createElement('div');
        expectedEditor.id = EDITOR_ID;
        expectedEditor.innerHTML = expectedHMTL;

        expect(editor).toEqual(expectedEditor);
    });

    it(`mark the typo within the stylistic - average length`, () => {
        const html = 'asd pra kli pra ghj';
        const editor = document.createElement('div');
        editor.id = EDITOR_ID;
        editor.innerHTML = html;

        const markings: TextMarking[] = [{
            from: 0,
            to: 19,
            type: "stylistic",
            subtype: "",
            description: "",
            suggestions: [{display: '', action: ''}]
        }, {
            from: 8,
            to: 11,
            type: "typo",
            subtype: "",
            description: "",
            suggestions: [{display: '', action: ''}]
        }];

        markText(editor, markings);

        const expectedHMTL = '<span class="stylistic">asd pra <span class="typo">kli</span> pra ghj</span>';
        const expectedEditor = document.createElement('div');
        expectedEditor.id = EDITOR_ID;
        expectedEditor.innerHTML = expectedHMTL;

        expect(editor).toEqual(expectedEditor);
    });

    it(`mark the typo within the very long stylistic marking`, () => {
        const html = 'Pra pra pra pra pra pra pra pra pra pra pra pra pra pra pra pra pra pra pra pra pra pra pra pra pra pra pra pra pra pra pra pra pra pra pra pra pra pra pra pra pra pra pra pra pra pra pra pra pra pra pra pra pra pra pra pra pra pra pra pra pra pra pra pra asd pra pra pra pra pra pra pra pra pra.';
        const editor = document.createElement('div');
        editor.id = EDITOR_ID;
        editor.innerHTML = html;

        const markings: TextMarking[] = [{
            from: 0,
            to: 296,
            type: "stylistic",
            subtype: "",
            description: "",
            suggestions: [{display: '', action: ''}]
        }, {
            from: 256,
            to: 259,
            type: "typo",
            subtype: "",
            description: "",
            suggestions: [{display: '', action: ''}]
        }];

        markText(editor, markings);

        const expectedHMTL = '<span class="stylistic">Pra pra pra pra pra pra pra pra pra pra pra pra pra pra pra pra pra pra pra pra pra pra pra pra pra pra pra pra pra pra pra pra pra pra pra pra pra pra pra pra pra pra pra pra pra pra pra pra pra pra pra pra pra pra pra pra pra pra pra pra pra pra pra pra <span class="typo">asd</span> pra pra pra pra pra pra pra pra pra.</span>';
        const expectedEditor = document.createElement('div');
        expectedEditor.id = EDITOR_ID;
        expectedEditor.innerHTML = expectedHMTL;

        expect(editor).toEqual(expectedEditor);
    });

    it(`mark the typo within the very long stylistic marking - v v long`, () => {
        const html = 'Pra pra pra pra pra pra pra pra pra pra pra pra pra pra pra pra pra pra pra pra pra pra pra pra pra pra pra pra pra pra pra pra pra pra pra pra pra pra pra pra pra pra pra pra pra pra pra pra pra pra pra pra pra pra pra pra pra pra pra pra pra pra pra pra asd pra pra pra pra pra pra pra pra pra. Edhe a a a a a a a a a a a a a a a kaq';
        const editor = document.createElement('div');
        editor.id = EDITOR_ID;
        editor.innerHTML = html;

        const markings: TextMarking[] = [{
            from: 0,
            to: 335,
            type: "stylistic",
            subtype: "",
            description: "",
            suggestions: [{display: '', action: ''}]
        }, {
            from: 256,
            to: 259,
            type: "typo",
            subtype: "",
            description: "",
            suggestions: [{display: '', action: ''}]
        }];

        markText(editor, markings);

        const expectedHMTL = '<span class="stylistic">Pra pra pra pra pra pra pra pra pra pra pra pra pra pra pra pra pra pra pra pra pra pra pra pra pra pra pra pra pra pra pra pra pra pra pra pra pra pra pra pra pra pra pra pra pra pra pra pra pra pra pra pra pra pra pra pra pra pra pra pra pra pra pra pra <span class="typo">asd</span> pra pra pra pra pra pra pra pra pra. Edhe a a a a a a a a a a a a a a a kaq</span>';
        const expectedEditor = document.createElement('div');
        expectedEditor.id = EDITOR_ID;
        expectedEditor.innerHTML = expectedHMTL;

        expect(editor).toEqual(expectedEditor);
    });

    it(`mark the typo within the stylistic padded with words on the sides`, () => {
        const html = 'kaq asd kli ghj pra';
        const editor = document.createElement('div');
        editor.id = EDITOR_ID;
        editor.innerHTML = html;

        const markings: TextMarking[] = [{
            from: 4,
            to: 15,
            type: "stylistic",
            subtype: "",
            description: "",
            suggestions: [{display: '', action: ''}]
        }, {
            from: 8,
            to: 11,
            type: "typo",
            subtype: "",
            description: "",
            suggestions: [{display: '', action: ''}]
        }];

        markText(editor, markings);

        const expectedHMTL = 'kaq <span class="stylistic">asd <span class="typo">kli</span> ghj</span> pra';
        const expectedEditor = document.createElement('div');
        expectedEditor.id = EDITOR_ID;
        expectedEditor.innerHTML = expectedHMTL;

        expect(editor).toEqual(expectedEditor);
    });

    it(`mark with a new line`, () => { // TODO will be addressed again soon for the paragraphs feat.
        const html = 'kaq asd kli\n ghj pra';
        const editor = document.createElement('div');
        editor.id = EDITOR_ID;
        editor.innerHTML = html;

        const markings: TextMarking[] = [{
            from: 4,
            to: 16,
            type: "stylistic",
            subtype: "",
            description: "",
            suggestions: [{display: '', action: ''}]
        }, {
            from: 8,
            to: 11,
            type: "typo",
            subtype: "",
            description: "",
            suggestions: [{display: '', action: ''}]
        }];

        markText(editor, markings);

        const expectedHMTL = 'kaq <span class="stylistic">asd <span class="typo">kli</span>\n ghj</span> pra';
        const expectedEditor = document.createElement('div');
        expectedEditor.id = EDITOR_ID;
        expectedEditor.innerHTML = expectedHMTL;

        expect(editor).toEqual(expectedEditor);
    });

    it(`should have as title 'penda'`, () => {
        const fixture = TestBed.createComponent(AppComponent);
        const app = fixture.componentInstance;
        expect(app.title).toEqual('penda');
    });
});
