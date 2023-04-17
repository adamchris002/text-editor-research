import React, { Component } from "react";
import Editor, { createEditorStateWithText } from "@draft-js-plugins/editor";
import createTextAlignmentPlugin from '@draft-js-plugins/text-alignment';
import createToolbarPlugin, { Separator } from "@draft-js-plugins/static-toolbar";
import editorStyles from "./editorStyles.module.css";
import "@draft-js-plugins/static-toolbar/lib/plugin.css";
import {
    ItalicButton,
    BoldButton,
    UnderlineButton,
    HeadlineOneButton,
    HeadlineTwoButton,
    HeadlineThreeButton,
    UnorderedListButton,
    OrderedListButton,
    AlignTextLeftButton,
    AlignTextCenterButton,
    AlignTextRightButton,
    
} from '@draft-js-plugins/buttons';
import SegmentIcon from '@mui/icons-material/Segment';

class HeadlinesPicker extends Component {
    componentDidMount() {
        setTimeout(() => {
            window.addEventListener('click', this.onWindowClick);
        });
    }

    componentWillUnmount() {
        window.removeEventListener('click', this.onWindowClick);
    }

    onWindowClick = () =>
        // Call `onOverrideContent` again with `undefined`
        // so the toolbar can show its regular content again.
        this.props.onOverrideContent(undefined);

    render() {
        const buttons = [HeadlineOneButton, HeadlineTwoButton, HeadlineThreeButton];
        return (
            <div>
                {buttons.map((Button, i) => (
                    // eslint-disable-next-line
                    <Button key={i} {...this.props} />
                ))}
            </div>
        );
    }
}

class AlignsPicker extends Component {
    componentDidMount() {
        setTimeout(() => {
            window.addEventListener('click', this.onWindowClick);
        });
    }

    componentWillUnmount() {
        window.removeEventListener('click', this.onWindowClick);
    }

    onWindowClick = () =>
        // Call `onOverrideContent` again with `undefined`
        // so the toolbar can show its regular content again.
        this.props.onOverrideContent(undefined);

    render() {
        const buttons = [AlignTextLeftButton, AlignTextCenterButton, AlignTextRightButton];
        return (
            <div>
                {buttons.map((Button, i) => (
                    // eslint-disable-next-line
                    <Button key={i} {...this.props} />
                ))}
            </div>
        );
    }
}

class AlignsButton extends Component {
    onClick = () =>
        // A button can call `onOverrideContent` to replace the content
        // of the toolbar. This can be useful for displaying sub
        // menus or requesting additional information from the user.
        this.props.onOverrideContent(AlignsPicker);

    render() {
        return (
            <div className={editorStyles.headlineButtonWrapper}>
                <button onClick={this.onClick} className={editorStyles.headlineButton}>
                    <SegmentIcon />
                </button>
            </div>
        );
    }
}

class HeadlinesButton extends Component {
    onClick = () =>
        // A button can call `onOverrideContent` to replace the content
        // of the toolbar. This can be useful for displaying sub
        // menus or requesting additional information from the user.
        this.props.onOverrideContent(HeadlinesPicker);

    render() {
        return (
            <div className={editorStyles.headlineButtonWrapper}>
                <button onClick={this.onClick} className={editorStyles.headlineButton}>
                    H
                </button>
            </div>
        );
    }
} 

const staticToolbarPlugin = createToolbarPlugin();

const { Toolbar } = staticToolbarPlugin;
const plugins = [staticToolbarPlugin];
const text = "Tell a Story...";

const getBlockStyle = (block) => {
    switch (block.getType()) {
        case 'left':
            return 'align-left';
        case 'center':
            return 'align-center';
        case 'right':
            return 'align-right';
        default:
            return null;
    }   
}


export default class SimpleStaticToolbarEditor extends Component {
    state = {
        editorState: createEditorStateWithText(text)
    };

    copyToClipboard = (editorState) => {
        // const blocks = convertToRaw(editorState.getCurrentContent()).blocks;
        // const value = blocks.map(block => (!block.text.trim() && '\n') || block.text).join('\n');
        // navigator.clipboard.writeText(value)
        const currentContent = editorState.getCurrentContent();
        const copiedText = currentContent.getPlainText();
        navigator.clipboard.writeText(copiedText)
    }

    clearTexteditor = () => {
        this.setState = {
            editorState: this.editorState.createEmpty(),
        }
    }

    onChange = (editorState) => {
        this.setState({
            editorState
        });
        console.log(editorState.getCurrentContent().getPlainText('\u0001'))
    };

    componentDidMount() {
        // fixing issue with SSR https://github.com/facebook/draft-js/issues/2332#issuecomment-761573306
        // eslint-disable-next-line react/no-did-mount-set-state
        this.setState({
            editorState: createEditorStateWithText(text)
        });
    }

    focus = () => {
        this.editor.focus();
    };

    

    render() {
        return (
            <div>
                <Toolbar>
                    {
                        // may be use React.Fragment instead of div to improve perfomance after React 16
                        (externalProps) => (
                            <div>
                                <HeadlinesButton {...externalProps} />
                                <Separator {...externalProps} />
                                <BoldButton {...externalProps} />
                                <ItalicButton {...externalProps} />
                                <UnderlineButton {...externalProps} />
                                <Separator {...externalProps} />
                                <AlignsButton {...externalProps} />
                                <Separator {...externalProps} />
                                <OrderedListButton {...externalProps} />
                                <UnorderedListButton {...externalProps} />
                                
                                {/* <Separator {...externalProps} />
                                <AlignTextCenterButton {...externalProps} />
                                <AlignTextLeftButton {...externalProps} />
                                <AlignTextRightButton {...externalProps} /> */}
                            </div>
                        )
                    }
                </Toolbar>
                <div className={editorStyles.editor} onClick={this.focus}>
                    <Editor
                        editorState={this.state.editorState}
                        onChange={this.onChange}
                        plugins={plugins}
                        blockStyleFn={getBlockStyle}
                        ref={(element) => {
                            this.editor = element;
                        }}
                    />
                </div>
                <button onClick={() => {
                    this.copyToClipboard(this.state.editorState)
                }}>
                    copy
                </button>
                <button
                    onClick={() => {
                        this.setState({
                            editorState: createEditorStateWithText("")
                        });
                    }}>
                    delete
                </button>
                <button>save</button>
            </div>
        );
    }
}
