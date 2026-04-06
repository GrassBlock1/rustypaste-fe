import {EditorState} from "@codemirror/state"
import {keymap} from "@codemirror/view"
import {defaultKeymap} from "@codemirror/commands"
import {EditorView, basicSetup} from "codemirror"
import {javascript} from "@codemirror/lang-javascript"
import {nord} from "@uiw/codemirror-theme-nord"

const appWindow = window as Window & {globalCode?: string}

// Expose editor content for other scripts.
const exportedContent = EditorView.updateListener.of((update) => {
    if (update.docChanged) {
        appWindow.globalCode = update.state.doc.toString();
    }
})
let startState = EditorState.create({
    doc: "Hello World",
    extensions: [basicSetup, nord, javascript(), keymap.of(defaultKeymap), exportedContent]
})

const editorParent = document.querySelector("div#editor")

if (editorParent) {
    new EditorView({
        state: startState,
        parent: editorParent
    })
}
