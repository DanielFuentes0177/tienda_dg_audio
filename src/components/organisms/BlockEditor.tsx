"use client";

import { useEditor, EditorContent, Editor } from '@tiptap/react';
import { BubbleMenu } from '@tiptap/react/menus';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import Youtube from '@tiptap/extension-youtube';
import { Color } from '@tiptap/extension-color';
import { TextStyle } from '@tiptap/extension-text-style';
import { Highlight } from '@tiptap/extension-highlight';
import { Table } from '@tiptap/extension-table';
import { TableRow } from '@tiptap/extension-table-row';
import { TableCell } from '@tiptap/extension-table-cell';
import { TableHeader } from '@tiptap/extension-table-header';
import React, { useState } from 'react';
import { useImageUpload } from "@/hooks/useImageUpload";
import { 
  Bold, Italic, Underline as UnderlineIcon, Strikethrough, 
  AlignLeft, AlignCenter, AlignRight, AlignJustify,
  List, ListOrdered, Quote, Minus, Image as ImageIcon,
  Video as VideoIcon, Undo, Redo, Link as LinkIcon,
  Table as TableIcon, Palette, Highlighter,
  AlignHorizontalDistributeStart, AlignHorizontalDistributeCenter, AlignHorizontalDistributeEnd
} from 'lucide-react';
import { cleanPastedHtml } from '@/lib/wordPaste';
import './BlockEditor.css'; 

interface BlockEditorProps {
  initialHtml?: string;
  onChange: (html: string) => void;
}

// 1. Custom Image Extension for Alignment
const CustomImage = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      align: {
        default: 'center',
        parseHTML: element => element.getAttribute('data-align') || 'center',
        renderHTML: attributes => {
          return {
            'data-align': attributes.align,
            class: `image-align-${attributes.align}`,
          }
        },
      },
    }
  },
});

const MenuBar = ({ editor }: { editor: Editor | null }) => {
  const { uploadImage, isUploading } = useImageUpload();
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showHighlightPicker, setShowHighlightPicker] = useState(false);

  if (!editor) {
    return null;
  }

  const addImage = async () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/jpeg, image/png, image/webp';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const url = await uploadImage(file);
        if (url) {
          editor.chain().focus().setImage({ src: url }).run();
        }
      }
    };
    input.click();
  };

  const addYoutubeVideo = () => {
    const url = prompt('Ingresa la URL del video de YouTube:');
    if (url) {
      editor.commands.setYoutubeVideo({ src: url, width: 640, height: 360 });
    }
  };

  const setLink = () => {
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('URL del enlace:', previousUrl);

    if (url === null) return;
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  };

  const insertTable = () => {
    editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
  };

  const colors = ['#000000', '#4b5563', '#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#a855f7', '#d4a437'];
  const highlights = ['#fef08a', '#bbf7d0', '#bfdbfe', '#fecaca', '#e5e7eb', 'transparent'];

  return (
    <div className="tiptap-toolbar">
      {/* Headings */}
      <select 
        className="toolbar-select"
        onChange={(e) => {
          const val = e.target.value;
          if (val === 'p') editor.chain().focus().setParagraph().run();
          else editor.chain().focus().toggleHeading({ level: parseInt(val) as any }).run();
        }}
        value={
          editor.isActive('heading', { level: 1 }) ? '1' :
          editor.isActive('heading', { level: 2 }) ? '2' :
          editor.isActive('heading', { level: 3 }) ? '3' : 'p'
        }
      >
        <option value="p">Párrafo</option>
        <option value="1">Título 1 (H1)</option>
        <option value="2">Título 2 (H2)</option>
        <option value="3">Título 3 (H3)</option>
      </select>

      <div className="toolbar-divider" />

      {/* Basic Formatting */}
      <button type="button" onClick={() => editor.chain().focus().toggleBold().run()} className={editor.isActive('bold') ? 'is-active' : ''} title="Negrita"><Bold size={16} /></button>
      <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()} className={editor.isActive('italic') ? 'is-active' : ''} title="Cursiva"><Italic size={16} /></button>
      <button type="button" onClick={() => editor.chain().focus().toggleUnderline().run()} className={editor.isActive('underline') ? 'is-active' : ''} title="Subrayado"><UnderlineIcon size={16} /></button>
      <button type="button" onClick={() => editor.chain().focus().toggleStrike().run()} className={editor.isActive('strike') ? 'is-active' : ''} title="Tachado"><Strikethrough size={16} /></button>
      
      <div className="toolbar-divider" />

      {/* Colors */}
      <div style={{ position: 'relative' }}>
        <button type="button" onClick={() => { setShowColorPicker(!showColorPicker); setShowHighlightPicker(false); }} title="Color de Texto">
          <Palette size={16} style={{ color: editor.getAttributes('textStyle').color || 'inherit' }} />
        </button>
        {showColorPicker && (
          <div className="color-picker-dropdown">
            {colors.map(c => (
              <div key={c} className="color-swatch" style={{ backgroundColor: c }} onClick={() => { editor.chain().focus().setColor(c).run(); setShowColorPicker(false); }} />
            ))}
            <div className="color-swatch" style={{ border: '1px solid #ddd', background: 'linear-gradient(45deg, #ccc 25%, transparent 25%, transparent 75%, #ccc 75%, #ccc), linear-gradient(45deg, #ccc 25%, transparent 25%, transparent 75%, #ccc 75%, #ccc)', backgroundPosition: '0 0, 4px 4px', backgroundSize: '8px 8px' }} onClick={() => { editor.chain().focus().unsetColor().run(); setShowColorPicker(false); }} title="Quitar Color" />
          </div>
        )}
      </div>

      <div style={{ position: 'relative' }}>
        <button type="button" onClick={() => { setShowHighlightPicker(!showHighlightPicker); setShowColorPicker(false); }} title="Color de Fondo">
          <Highlighter size={16} style={{ color: editor.getAttributes('highlight').color || 'inherit' }} />
        </button>
        {showHighlightPicker && (
          <div className="color-picker-dropdown">
            {highlights.map(c => (
              <div 
                key={c} 
                className="color-swatch" 
                style={{ backgroundColor: c === 'transparent' ? '#fff' : c, border: c === 'transparent' ? '1px solid #ddd' : 'none' }} 
                onClick={() => { 
                  if (c === 'transparent') {
                    editor.chain().focus().unsetHighlight().run();
                  } else {
                    editor.chain().focus().toggleHighlight({ color: c }).run();
                  }
                  setShowHighlightPicker(false); 
                }} 
                title={c === 'transparent' ? 'Quitar Resaltado' : ''} 
              />
            ))}
          </div>
        )}
      </div>

      <div className="toolbar-divider" />

      {/* Alignment */}
      <button type="button" onClick={() => editor.chain().focus().setTextAlign('left').run()} className={editor.isActive({ textAlign: 'left' }) ? 'is-active' : ''} title="Alinear Izquierda"><AlignLeft size={16} /></button>
      <button type="button" onClick={() => editor.chain().focus().setTextAlign('center').run()} className={editor.isActive({ textAlign: 'center' }) ? 'is-active' : ''} title="Alinear Centro"><AlignCenter size={16} /></button>
      <button type="button" onClick={() => editor.chain().focus().setTextAlign('right').run()} className={editor.isActive({ textAlign: 'right' }) ? 'is-active' : ''} title="Alinear Derecha"><AlignRight size={16} /></button>
      <button type="button" onClick={() => editor.chain().focus().setTextAlign('justify').run()} className={editor.isActive({ textAlign: 'justify' }) ? 'is-active' : ''} title="Justificar"><AlignJustify size={16} /></button>

      <div className="toolbar-divider" />

      {/* Lists & Quotes */}
      <button type="button" onClick={() => editor.chain().focus().toggleBulletList().run()} className={editor.isActive('bulletList') ? 'is-active' : ''} title="Viñetas"><List size={16} /></button>
      <button type="button" onClick={() => editor.chain().focus().toggleOrderedList().run()} className={editor.isActive('orderedList') ? 'is-active' : ''} title="Lista Numerada"><ListOrdered size={16} /></button>
      <button type="button" onClick={() => editor.chain().focus().toggleBlockquote().run()} className={editor.isActive('blockquote') ? 'is-active' : ''} title="Cita"><Quote size={16} /></button>
      <button type="button" onClick={() => editor.chain().focus().setHorizontalRule().run()} title="Separador"><Minus size={16} /></button>
      
      <div className="toolbar-divider" />

      {/* Rich Media & Tables */}
      <button type="button" onClick={setLink} className={editor.isActive('link') ? 'is-active' : ''} title="Insertar Enlace"><LinkIcon size={16} /></button>
      <button type="button" onClick={addImage} title="Insertar Imagen dentro del texto" disabled={isUploading}><ImageIcon size={16} /></button>
      <button type="button" onClick={addYoutubeVideo} title="Insertar Video YouTube"><VideoIcon size={16} /></button>
      <button type="button" onClick={insertTable} title="Insertar Tabla"><TableIcon size={16} /></button>

      <div className="toolbar-divider" />

      {/* History */}
      <button type="button" onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()} title="Deshacer"><Undo size={16} /></button>
      <button type="button" onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()} title="Rehacer"><Redo size={16} /></button>
    </div>
  );
};

export function BlockEditor({ initialHtml, onChange }: BlockEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextStyle,
      Color,
      Highlight.configure({ multicolor: true }),
      Link.configure({ openOnClick: false }),
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      CustomImage.configure({ inline: true, allowBase64: true }),
      Youtube.configure({ inline: false, controls: false }),
      Table.configure({ resizable: true }),
      TableRow,
      TableHeader,
      TableCell,
    ],
    content: initialHtml || '',
    // Pegar desde Word: convierte sus listas y limpia estilos de Office (ver lib/wordPaste.ts)
    editorProps: { transformPastedHTML: cleanPastedHtml },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  return (
    <div className="tiptap-container" onClick={(e) => {
      // Close dropdowns when clicking outside
      const target = e.target as HTMLElement;
      if (!target.closest('.tiptap-toolbar')) {
         // Dropdowns are managed by local state in MenuBar, 
         // Since they are inline, the actual click outside might not work perfectly with just this,
         // but it's a start. For a robust solution we'd use a ref.
      }
    }}>
      <MenuBar editor={editor} />
      
      {/* Bubble Menu for Images */}
      {editor && (
        <BubbleMenu 
          editor={editor} 
          shouldShow={({ editor }) => editor.isActive('image')}
        >
          <div className="bubble-menu">
            <button 
              type="button"
              className={editor.getAttributes('image').align === 'left' ? 'is-active' : ''}
              onClick={() => editor.chain().focus().updateAttributes('image', { align: 'left' }).run()}
              title="Alinear Izquierda (Envuelve el texto)"
            >
              <AlignHorizontalDistributeStart size={16} />
            </button>
            <button 
              type="button"
              className={editor.getAttributes('image').align === 'center' ? 'is-active' : ''}
              onClick={() => editor.chain().focus().updateAttributes('image', { align: 'center' }).run()}
              title="Centrar (Rompe el texto)"
            >
              <AlignHorizontalDistributeCenter size={16} />
            </button>
            <button 
              type="button"
              className={editor.getAttributes('image').align === 'right' ? 'is-active' : ''}
              onClick={() => editor.chain().focus().updateAttributes('image', { align: 'right' }).run()}
              title="Alinear Derecha (Envuelve el texto)"
            >
              <AlignHorizontalDistributeEnd size={16} />
            </button>
            <div className="toolbar-divider" style={{ margin: '0 8px', height: '16px', backgroundColor: 'rgba(255,255,255,0.2)' }} />
            <button
              type="button"
              onClick={() => {
                const currentAlt = editor.getAttributes('image').alt || '';
                const newAlt = prompt('Texto Alternativo (Alt SEO) para esta imagen:', currentAlt);
                if (newAlt !== null) {
                  editor.chain().focus().updateAttributes('image', { alt: newAlt }).run();
                }
              }}
              title={editor.getAttributes('image').alt ? `Alt: ${editor.getAttributes('image').alt}` : "Añadir texto Alt (SEO)"}
              style={{ color: editor.getAttributes('image').alt ? '#a3e635' : '#fff' }}
            >
              SEO Alt
            </button>
          </div>
        </BubbleMenu>
      )}

      {/* Bubble Menu for Tables */}
      {editor && (
        <BubbleMenu 
          editor={editor} 
          shouldShow={({ editor }) => editor.isActive('table')}
        >
          <div className="bubble-menu">
            <button type="button" onClick={() => editor.chain().focus().addColumnBefore().run()}>+ Col Izq</button>
            <button type="button" onClick={() => editor.chain().focus().addColumnAfter().run()}>+ Col Der</button>
            <button type="button" onClick={() => editor.chain().focus().deleteColumn().run()} style={{color: '#ef4444'}}>- Col</button>
            <div className="toolbar-divider" style={{ margin: '0 8px', height: '16px', backgroundColor: 'rgba(255,255,255,0.2)' }} />
            <button type="button" onClick={() => editor.chain().focus().addRowBefore().run()}>+ Fila Arr</button>
            <button type="button" onClick={() => editor.chain().focus().addRowAfter().run()}>+ Fila Aba</button>
            <button type="button" onClick={() => editor.chain().focus().deleteRow().run()} style={{color: '#ef4444'}}>- Fila</button>
            <div className="toolbar-divider" style={{ margin: '0 8px', height: '16px', backgroundColor: 'rgba(255,255,255,0.2)' }} />
            <button type="button" onClick={() => editor.chain().focus().deleteTable().run()} style={{color: '#ef4444', fontWeight: 'bold'}}>Borrar</button>
          </div>
        </BubbleMenu>
      )}

      <div className="tiptap-editor-wrapper">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
