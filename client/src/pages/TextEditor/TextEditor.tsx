import { useEffect, useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { api } from '@/lib/api';
import { SimpleEditor } from '@/lib/components/simple-editor/simple-editor';

export default function EditorPage() {
  const [content, setContent] = useState<any | null>(null);
  const [title, setTitle] = useState<string>(`Document ${new Date().toLocaleDateString()}`);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const titleInputRef = useRef<HTMLInputElement>(null);
  const location = useLocation();

  useEffect(() => {
    const getDocumentData = async (documentId: string) => {
      const { data } = await api.get(`/apiv1/documents/${documentId}`);
      setContent(data);
      setTitle(data.title || 'Без названия');
    };

    if (location.state?.docId) {
      getDocumentData(location.state.docId);
    }
  }, [location.state]);

  const handleTitleClick = () => {
    setIsEditingTitle(true);
    setTimeout(() => titleInputRef.current?.focus(), 0);
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  const handleTitleBlur = async () => {
    setIsEditingTitle(false);

    if (!content?.id || title === content.title) return;

    try {
      setContent({ ...content, title });
    } catch (error) {
      console.error('Ошибка при обновлении заголовка:', error);
      setTitle(content.title);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      titleInputRef.current?.blur();
    } else if (e.key === 'Escape') {
      setTitle(content.title);
      setIsEditingTitle(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex gap-5 justify-between">
        {isEditingTitle ? (
          <input
            ref={titleInputRef}
            type="text"
            value={title}
            onChange={handleTitleChange}
            onBlur={handleTitleBlur}
            onKeyDown={handleKeyDown}
            className="text-2xl font-bold mb-4 w-full bg-transparent border-b border-gray-300 focus:border-blue-500 outline-none"
          />
        ) : (
          <h1
            className="text-2xl font-bold mb-4 cursor-text rounded px-2 py-1"
            onClick={handleTitleClick}
          >
            {title}
          </h1>
        )}
      </div>
      <SimpleEditor initContent={content?.content} documentId={content?.id} documentTitle={title} />
    </div>
  );
}
