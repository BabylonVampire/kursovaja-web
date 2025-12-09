import { Editor, EditorContent, EditorContext, useEditor } from '@tiptap/react';
import * as React from 'react';

// --- Tiptap Core Extensions ---
import { Highlight } from '@tiptap/extension-highlight';
import { Image } from '@tiptap/extension-image';
import { Subscript } from '@tiptap/extension-subscript';
import { Superscript } from '@tiptap/extension-superscript';
import { TaskItem } from '@tiptap/extension-task-item';
import { TaskList } from '@tiptap/extension-task-list';
import { TextAlign } from '@tiptap/extension-text-align';
import { Typography } from '@tiptap/extension-typography';
import { Underline } from '@tiptap/extension-underline';
import { StarterKit } from '@tiptap/starter-kit';

// --- Custom Extensions ---
import { Link } from '@/components/tiptap-extension/link-extension';
import { Selection } from '@/components/tiptap-extension/selection-extension';
import { TrailingNode } from '@/components/tiptap-extension/trailing-node-extension';

// --- UI Primitives ---
import { Button } from '@/components/tiptap-ui-primitive/button';
import { Spacer } from '@/components/tiptap-ui-primitive/spacer';
import { Toolbar, ToolbarGroup, ToolbarSeparator } from '@/components/tiptap-ui-primitive/toolbar';

// --- Tiptap Node ---
import '@/components/tiptap-node/code-block-node/code-block-node.scss';
import '@/components/tiptap-node/image-node/image-node.scss';
import { ImageUploadNode } from '@/components/tiptap-node/image-upload-node/image-upload-node-extension';
import '@/components/tiptap-node/list-node/list-node.scss';
import '@/components/tiptap-node/paragraph-node/paragraph-node.scss';

// --- Tiptap UI ---
import { BlockQuoteButton } from '@/components/tiptap-ui/blockquote-button';
import { CodeBlockButton } from '@/components/tiptap-ui/code-block-button';
import {
  ColorHighlightPopover,
  ColorHighlightPopoverButton,
  ColorHighlightPopoverContent,
} from '@/components/tiptap-ui/color-highlight-popover';
import { HeadingDropdownMenu } from '@/components/tiptap-ui/heading-dropdown-menu';
import { ImageUploadButton } from '@/components/tiptap-ui/image-upload-button';
import { LinkButton, LinkContent, LinkPopover } from '@/components/tiptap-ui/link-popover';
import { ListDropdownMenu } from '@/components/tiptap-ui/list-dropdown-menu';
import { MarkButton } from '@/components/tiptap-ui/mark-button';
import { TextAlignButton } from '@/components/tiptap-ui/text-align-button';
import { UndoRedoButton } from '@/components/tiptap-ui/undo-redo-button';

// --- Icons ---
import { ArrowLeftIcon } from '@/components/tiptap-icons/arrow-left-icon';
import { HighlighterIcon } from '@/components/tiptap-icons/highlighter-icon';
import { LinkIcon } from '@/components/tiptap-icons/link-icon';

// --- Hooks ---
import { useCursorVisibility } from '@/lib/hooks/use-cursor-visibility';
import { useMobile } from '@/lib/hooks/use-mobile';
import { useWindowSize } from '@/lib/hooks/use-window-size';

// --- Lib ---
import { MAX_FILE_SIZE } from '@/lib/tiptap-utils';

// --- Styles ---
import './simple-editor.scss';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/tiptap-ui-primitive/dropdown-menu';
import { api } from '@/lib/api';
import { USER_TOKEN_KEY } from '@/lib/constants';
import dayjs from 'dayjs';
import {
  Check,
  FileCode2,
  FileText,
  FileType,
  MessageCircle,
  Plus,
  TableRowsSplit,
  X,
} from 'lucide-react';
import { Textarea } from '../ui/textarea';
import { TComment } from './simple-editor.types';
import HorizontalRule from '@tiptap/extension-horizontal-rule';

export const handleImageUpload = async (file: File) => {
  try {
    const formData = new FormData();
    formData.append('image', file);

    const { data: response } = await api.post(
      '/apiv1/files/upload',

      formData,
    );

    return response.url;
  } catch (error) {
    console.error('Upload error:', error);
    throw error;
  }
};

const MainToolbarContent = ({
  onHighlighterClick,
  onLinkClick,
  editor,
  documentId = null,
  documentTitle = null,
  toggleComments,
}: {
  onHighlighterClick: () => void;
  onLinkClick: () => void;
  editor: Editor | null;
  documentId: string | null;
  documentTitle: string | null;
  toggleComments: () => void;
}) => {
  if (!editor) {
    return;
  }

  const isMobile = useMobile();
  const [isExporting, setIsExporting] = React.useState(false);
  const [currentDocumentId, setCurrentDocumentId] = React.useState<string | null>(null);
  const [isSaving, setIsSaving] = React.useState(false);

  React.useEffect(() => {
    setCurrentDocumentId(documentId);
  }, [documentId]);

  const PdfIcon = () => <FileText className="tiptap-button-icon" />;
  const WordIcon = () => <FileType className="tiptap-button-icon" />;
  const LatexIcon = () => <FileCode2 className="tiptap-button-icon" />;

  const handleExport = async (format: 'pdf' | 'docx' | 'latex') => {
    try {
      setIsExporting(true);

      const response = await fetch('apiv1/documents/convert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: editor.getHTML(),
          format,
        }),
      });

      if (!response.ok) {
        throw new Error(`Ошибка сервера: ${response.status}`);
      }

      const blob = await response.blob();

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `document.${format}`;

      document.body.appendChild(a);
      a.click();

      setTimeout(() => {
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      }, 100);
    } catch (error) {
      console.error('Ошибка экспорта:', error);
      alert(`Экспорт не удался: ${error}`);
    } finally {
      setIsExporting(false);
    }
  };

  const saveDocument = async () => {
    if (!editor) return;
    setIsSaving(true);

    try {
      const content = editor.getHTML();
      const title = documentTitle || `Document ${new Date().toLocaleDateString()}`;

      const apiUrl = currentDocumentId
        ? `/apiv1/documents/${currentDocumentId}`
        : '/apiv1/documents';

      const method = currentDocumentId ? 'PUT' : 'POST';

      const userId = JSON.parse(localStorage.getItem(USER_TOKEN_KEY) || '')?.id;

      const response = await fetch(apiUrl, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          title,
          content,
          userId,
        }),
      });

      const data = await response.json();

      if (!currentDocumentId) {
        setCurrentDocumentId(data.id);
      }
    } catch (error) {
      console.error('Save error:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const loadDocuments = async () => {
    try {
      const response = await fetch('/apiv1/documents', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      return await response.json();
    } catch (error) {
      console.error('Load error:', error);
      return [];
    }
  };

  const addPageBreak = () =>
    editor
      .chain()
      .focus()
      .insertContent('<hr data-type="pagebreak" style="page-break-after: always;"/><p></p>')
      .run();

  return (
    <>
      <Spacer />

      <ToolbarGroup>
        <Button data-style="ghost" onClick={saveDocument} disabled={isSaving}>
          {isSaving ? 'Saving...' : 'Сохранить'}
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button data-style="ghost">Загрузить</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>{/* Здесь будет список документов */}</DropdownMenuContent>
        </DropdownMenu>
      </ToolbarGroup>

      <ToolbarGroup>
        <UndoRedoButton action="undo" />
        <UndoRedoButton action="redo" />
      </ToolbarGroup>

      <ToolbarSeparator />

      <ToolbarGroup>
        <HeadingDropdownMenu levels={[1, 2, 3, 4]} />
        <ListDropdownMenu types={['bulletList', 'orderedList', 'taskList']} />
        <BlockQuoteButton />
        <CodeBlockButton />
      </ToolbarGroup>

      <ToolbarSeparator />

      <ToolbarGroup>
        <MarkButton type="bold" />
        <MarkButton type="italic" />
        <MarkButton type="strike" />
        <MarkButton type="code" />
        <MarkButton type="underline" />
        {!isMobile ? (
          <ColorHighlightPopover />
        ) : (
          <ColorHighlightPopoverButton onClick={onHighlighterClick} />
        )}
        {!isMobile ? <LinkPopover /> : <LinkButton onClick={onLinkClick} />}
      </ToolbarGroup>

      <ToolbarSeparator />

      <ToolbarGroup>
        <MarkButton type="superscript" />
        <MarkButton type="subscript" />
      </ToolbarGroup>

      <ToolbarSeparator />

      <ToolbarGroup>
        <TextAlignButton align="left" />
        <TextAlignButton align="center" />
        <TextAlignButton align="right" />
        <TextAlignButton align="justify" />
      </ToolbarGroup>

      <ToolbarSeparator />

      <ToolbarGroup>
        <ImageUploadButton text="Add" />
      </ToolbarGroup>

      <ToolbarSeparator />

      <ToolbarGroup>
        <Button data-style="ghost" onClick={addPageBreak}>
          <TableRowsSplit />
        </Button>
      </ToolbarGroup>

      <ToolbarSeparator />

      <ToolbarGroup>
        <Button data-style="ghost" onClick={toggleComments}>
          <MessageCircle />
        </Button>
      </ToolbarGroup>

      <Spacer />

      {isMobile && <ToolbarSeparator />}

      <ToolbarSeparator />

      <ToolbarGroup>
        <Button data-style="ghost" onClick={() => handleExport('pdf')} disabled={isExporting}>
          <PdfIcon />
          {!isMobile && 'PDF'}
        </Button>
        <Button data-style="ghost" onClick={() => handleExport('docx')} disabled={isExporting}>
          <WordIcon />
          {!isMobile && 'Word'}
        </Button>
        <Button data-style="ghost" onClick={() => handleExport('latex')} disabled={isExporting}>
          <LatexIcon />
          {!isMobile && 'LaTeX'}
        </Button>
      </ToolbarGroup>
    </>
  );
};

const MobileToolbarContent = ({
  type,
  onBack,
}: {
  type: 'highlighter' | 'link';
  onBack: () => void;
}) => (
  <>
    <ToolbarGroup>
      <Button data-style="ghost" onClick={onBack}>
        <ArrowLeftIcon className="tiptap-button-icon" />
        {type === 'highlighter' ? (
          <HighlighterIcon className="tiptap-button-icon" />
        ) : (
          <LinkIcon className="tiptap-button-icon" />
        )}
      </Button>
    </ToolbarGroup>

    <ToolbarSeparator />

    {type === 'highlighter' ? <ColorHighlightPopoverContent /> : <LinkContent />}
  </>
);

export const SimpleEditor = ({
  initContent = '<p></p>',
  documentId = null,
  documentTitle = null,
}: {
  initContent: string;
  documentId: string | null;
  documentTitle: string | null;
}) => {
  const isMobile = useMobile();
  const windowSize = useWindowSize();
  const [mobileView, setMobileView] = React.useState<'main' | 'highlighter' | 'link'>('main');
  const toolbarRef = React.useRef<HTMLDivElement>(null);
  const [isCommentsShown, setIsCommentsShown] = React.useState(false);
  const [comments, setComments] = React.useState<TComment[] | null>(null);
  const [isCommentModalOpened, setIsCommentModalOpened] = React.useState(false);
  const [commentValue, setCommentValue] = React.useState<string>('');

  const toggleComments = () => setIsCommentsShown((prev) => !prev);

  const CustomHorizontalRule = HorizontalRule.extend({
    addAttributes() {
      return {
        type: {
          default: null,
          parseHTML: (element) => element.getAttribute('data-type'),
          renderHTML: (attributes) => {
            if (attributes.type) {
              return {
                'data-type': attributes.type,
              };
            }
          },
        },
      };
    },
  });

  const editor = useEditor({
    immediatelyRender: false,
    editorProps: {
      attributes: {
        'autocomplete': 'off',
        'autocorrect': 'off',
        'autocapitalize': 'off',
        'aria-label': 'Main content area, start typing to enter text.',

        'class':
          'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto p-10 rounded-b-xl focus:outline-none',
      },
    },
    extensions: [
      StarterKit,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Underline,
      TaskList,
      TaskItem.configure({ nested: true }),
      Highlight.configure({ multicolor: true }),
      Image,
      Typography,
      Superscript,
      Subscript,
      Selection,
      CustomHorizontalRule,
      ImageUploadNode.configure({
        accept: 'image/*',
        maxSize: MAX_FILE_SIZE,
        limit: 3,
        upload: handleImageUpload,
        onError: (error) => console.error('Upload failed:', error),
      }),
      TrailingNode,
      Link.configure({ openOnClick: false }),
    ],
    content: initContent,
  });

  React.useEffect(() => {
    if (editor && initContent !== editor.getHTML()) {
      editor.commands.setContent(initContent);
    }
  }, [initContent, editor]);

  const bodyRect = useCursorVisibility({
    editor,
    overlayHeight: toolbarRef.current?.getBoundingClientRect().height ?? 0,
  });

  React.useEffect(() => {
    if (!isMobile && mobileView !== 'main') {
      setMobileView('main');
    }
  }, [isMobile, mobileView]);

  const leaveComment = () => {
    const userName = JSON.parse(localStorage.getItem(USER_TOKEN_KEY) || '{}').email;
    const userId = JSON.parse(localStorage.getItem(USER_TOKEN_KEY) || '{}').id;
    const newComment = {
      userName,
      text: commentValue,
      date: new Date(),
      isResolved: false,
      isCanceled: false,
      userId,
    };
    setComments((prev) => (prev ? [...prev, newComment] : [newComment]));
    setIsCommentModalOpened(false);
    setCommentValue('');
  };

  return (
    <EditorContext.Provider value={{ editor }}>
      <Toolbar
        ref={toolbarRef}
        style={
          isMobile
            ? {
                bottom: `calc(100% - ${windowSize.height - bodyRect.y}px)`,
              }
            : {}
        }
      >
        {mobileView === 'main' ? (
          <MainToolbarContent
            onHighlighterClick={() => setMobileView('highlighter')}
            onLinkClick={() => setMobileView('link')}
            editor={editor}
            documentId={documentId}
            documentTitle={documentTitle}
            toggleComments={toggleComments}
          />
        ) : (
          <MobileToolbarContent
            type={mobileView === 'highlighter' ? 'highlighter' : 'link'}
            onBack={() => setMobileView('main')}
          />
        )}
      </Toolbar>

      <div className="content-wrapper">
        <EditorContent editor={editor} role="presentation" className="simple-editor-content" />
        {isCommentsShown && (
          <div className="comments-column">
            {comments &&
              comments.map((comment) => (
                <div className="comment-item">
                  <div className="comment-item-resolved-flag">
                    <Check className="comment-item-icon" size={14} />
                  </div>
                  <div className="comment-item-canceled-flag">
                    <X className="comment-item-icon" size={14} />
                  </div>
                  <p className="comment-item-username">{comment.userName}</p>
                  <p className="comment-item-text">{comment.text}</p>
                  <p className="comment-item-date">
                    {dayjs(comment.date).format('HH:mm DD.MM.YY')}
                  </p>
                </div>
              ))}
            {isCommentModalOpened && (
              <div className="comment-form">
                <Textarea
                  className="comment-form-text-field"
                  value={commentValue}
                  onChange={(e) => setCommentValue(e.target.value)}
                />
              </div>
            )}
            <div className="button-box">
              <Button
                data-style="ghost"
                onClick={() =>
                  isCommentModalOpened ? leaveComment() : setIsCommentModalOpened(true)
                }
              >
                Оставить комментарий {!isCommentModalOpened && <Plus />}
              </Button>
              {isCommentModalOpened && (
                <Button
                  className="button-cancel"
                  onClick={() => {
                    setIsCommentModalOpened(false);
                    setCommentValue('');
                  }}
                >
                  Отмена
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </EditorContext.Provider>
  );
};
