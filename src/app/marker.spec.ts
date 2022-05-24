import {TestBed} from '@angular/core/testing';
import {AppComponent} from './app.component';
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {TextMarking} from "./Models/TextMarking";
import {Suggestion} from "./Models/Suggestion";

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

        const app = TestBed.createComponent(AppComponent).componentInstance;
        app.markText(editor, markings);

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

        const app = TestBed.createComponent(AppComponent).componentInstance;
        app.markText(editor, markings);

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

        const app = TestBed.createComponent(AppComponent).componentInstance;
        app.markText(editor, markings);

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

        const app = TestBed.createComponent(AppComponent).componentInstance;
        app.markText(editor, markings);

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

        const app = TestBed.createComponent(AppComponent).componentInstance;
        app.markText(editor, markings);

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

        const app = TestBed.createComponent(AppComponent).componentInstance;
        app.markText(editor, markings);

        const expectedHMTL = '<span class="typo">asd</span> <span class="typo">kli</span>';
        const expectedEditor = document.createElement('div');
        expectedEditor.id = EDITOR_ID;
        expectedEditor.innerHTML = expectedHMTL;
        console.log(editor);
        console.log(expectedEditor);

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

        const app = TestBed.createComponent(AppComponent).componentInstance;
        app.markText(editor, markings);

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

        const app = TestBed.createComponent(AppComponent).componentInstance;
        app.markText(editor, markings);

        const expectedHMTL = '<span class="stylistic">asd <span class="typo">kli</span> ghj</span>';
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

        const app = TestBed.createComponent(AppComponent).componentInstance;
        app.markText(editor, markings);

        const expectedHMTL = 'kaq <span class="stylistic">asd <span class="typo">kli</span> ghj</span> pra';
        const expectedEditor = document.createElement('div');
        expectedEditor.id = EDITOR_ID;
        expectedEditor.innerHTML = expectedHMTL;
        console.log(editor.innerHTML);
        console.log(expectedEditor.innerHTML);

        expect(editor).toEqual(expectedEditor);
    });


    it(`should have as title 'penda'`, () => {
        const fixture = TestBed.createComponent(AppComponent);
        const app = fixture.componentInstance;
        expect(app.title).toEqual('penda');
    });
});
