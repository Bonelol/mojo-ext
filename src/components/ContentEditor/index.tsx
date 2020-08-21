import * as React from "react";
import { PluginEvent, PluginEventType } from "roosterjs-editor-types";
import {
    ContentChangedPlugin,
    createEditorViewState,
    DoubleClickImagePlugin,
    FocusEventHandler,
    FocusOutShell,
    ImageManager,
    ImageManagerOptions,
    ImageResize,
    LeanRooster,
    LeanRoosterModes,
    PasteImagePlugin,
    RoosterCommandBar,
    RoosterCommandBarPlugin,
    TableResize,
    UndoWithImagePlugin
} from "roosterjs-react";

import { initializeIcons } from 'office-ui-fabric-react/lib/Icons';
import { useState } from "react";

import './index.scss';

initializeIcons('https://static2.sharepointonline.com/files/fabric/assets/icons/');

class ContentChangedLoggerPlugin extends ContentChangedPlugin {
    constructor() {
        super(_ => console.log("Content changed"));
    }

    public onPluginEvent(event: PluginEvent): void {
        if (event && event.eventType === PluginEventType.ContentChanged) {
            console.log(`Content changed from ${(event as any).source}`);
        }
    }
}

export interface ContentEditorProps {
    content: string;
    onChange?: (value: string) => void;
    onImagePaste?: (name: string, buffer: ArrayBuffer, resolve: (value?: string | PromiseLike<string>) => void) => void;
}

const placeholderImageClassName = "dblclick-bypass";
const excludePlaceholderSelector = `:not(.${placeholderImageClassName})`;

const ContentEditor = (props: ContentEditorProps) => {
    const { content, onChange, onImagePaste } = props;
    let leanRoosterContentDiv: HTMLDivElement;
    const leanRoosterContentDivOnRef = (ref: HTMLDivElement) => (leanRoosterContentDiv = ref);

    let leanRooster: LeanRooster;
    const leanRoosterOnRef = (ref: LeanRooster) => (leanRooster = ref);

    let commandBar: RoosterCommandBar;
    const commandBarOnRef = (ref: RoosterCommandBar) => (commandBar = ref);

    const imageManager = new ImageManager({
        uploadImage: (image: File) =>
            new Promise<string>((resolve, reject) => {
                // fake upload failure if type isn't image
                if (image.type.indexOf("image/") !== 0) {
                    reject();
                    console.log(`Upload failed`);
                    return;
                }
                
                const reader = new FileReader();
                reader.onload = (event: ProgressEvent) => {
                    const buffer: ArrayBuffer = (event.target as FileReader).result as ArrayBuffer;
                    onImagePaste && onImagePaste(image.name, buffer, resolve);
                };
                reader.readAsArrayBuffer(image);
            }),
        placeholderImageClassName
    } as ImageManagerOptions);

    const leanRoosterViewState = createEditorViewState(content);
    const imagePlugin = new PasteImagePlugin(imageManager);
    const imageResizePlugin = new ImageResize(undefined, undefined, undefined, undefined, excludePlaceholderSelector);

    const [commandBarPlugin] = useState(new RoosterCommandBarPlugin());
    const plugins = [
        commandBarPlugin,
        imagePlugin,
        imageResizePlugin,
        new TableResize(),
        new ContentChangedLoggerPlugin(),
        new DoubleClickImagePlugin(excludePlaceholderSelector)
    ];

    const focusOutShellAllowMouseDown = (element: HTMLElement): boolean => {
        return leanRoosterContentDiv && leanRoosterContentDiv.contains(element);
    }

    const focusOutShellOnFocus = (ev: React.FocusEvent<HTMLElement>) => {
        commandBarPlugin.registerRoosterCommandBar(commandBar); // re-register command b/c we're changing mode on blur
        leanRooster.mode = LeanRoosterModes.Edit;
    };

    const focusOutShellOnBlur = (ev: React.FocusEvent<HTMLElement>) => {
        leanRooster.mode = LeanRoosterModes.View;
        imageResizePlugin.hideResizeHandle();
    };

    const onBlur = () => {
        onChange && onChange(leanRooster.getContent());
    }
    
    const timeSpan = new Date().getTime();

    return (
        <FocusOutShell allowMouseDown={focusOutShellAllowMouseDown} onBlur={focusOutShellOnBlur} onFocus={focusOutShellOnFocus}>
            {(calloutClassName: string, calloutOnDismiss: FocusEventHandler) => {                
                return [
                    <LeanRooster
                        key={`${timeSpan}-leanRooster`}
                        viewState={leanRoosterViewState}
                        plugins={plugins}
                        undo={new UndoWithImagePlugin(imageManager)}
                        ref={leanRoosterOnRef}
                        contentDivRef={leanRoosterContentDivOnRef}
                        hyperlinkToolTipCallback={(url: string) => `CTRL+Click to follow link\n${url}`}
                        clickOpenHyperlinkViewMode={true}
                        defaultFormat={{}}
                        data-foo="bar"
                        onBlur={onBlur}
                    />,
                    <RoosterCommandBar
                        key={`${timeSpan}-commandBar`}
                        className="lean-cmdbar"
                        roosterCommandBarPlugin={commandBarPlugin}
                        calloutClassName={calloutClassName}
                        calloutOnDismiss={calloutOnDismiss}                        
                        imageManager={imageManager}
                        ref={commandBarOnRef}
                        overflowMenuProps={{ className: "custom-overflow" }}
                        disableListWorkaround={true}
                    />
                ];
            }}
        </FocusOutShell>
    );
}

export default ContentEditor;