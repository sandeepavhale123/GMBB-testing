import React, { useRef } from "react";
import { Editor } from "@tinymce/tinymce-react";
import DOMPurify from "dompurify";

// Import TinyMCE core and required plugins for self-hosted usage
import "tinymce/tinymce";
import "tinymce/models/dom";
import "tinymce/themes/silver";
import "tinymce/icons/default";
import "tinymce/plugins/lists";
import "tinymce/plugins/link";
import "tinymce/plugins/autolink";
import "tinymce/skins/ui/oxide/skin.min.css";

interface RichTextEditorProps {
  value: string;
  onChange: (content: string) => void;
  disabled?: boolean;
  placeholder?: string;
  height?: number;
}

// Security configuration for DOMPurify
const SANITIZE_CONFIG = {
  ALLOWED_TAGS: ['p', 'br', 'strong', 'b', 'em', 'i', 'u', 'ul', 'ol', 'li', 'a', 'span', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
  ALLOWED_ATTR: ['href', 'target', 'rel', 'class', 'style'],
  FORBID_TAGS: ['script', 'iframe', 'object', 'embed', 'form', 'input', 'button', 'textarea', 'select'],
  FORBID_ATTR: ['onerror', 'onclick', 'onload', 'onmouseover', 'onmouseout', 'onkeydown', 'onkeyup', 'onfocus', 'onblur'],
  ALLOW_DATA_ATTR: false,
};

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  disabled = false,
  placeholder = "",
  height = 300
}) => {
  const editorRef = useRef<any>(null);

  const handleEditorChange = (content: string) => {
    // Sanitize content before passing to parent to prevent XSS
    const sanitizedContent = DOMPurify.sanitize(content, SANITIZE_CONFIG);
    onChange(sanitizedContent);
  };

  return (
    <div className="rich-text-editor-wrapper">
      <Editor
        licenseKey="gpl"
        onInit={(_evt, editor) => editorRef.current = editor}
        value={value}
        onEditorChange={handleEditorChange}
        disabled={disabled}
        init={{
          height,
          menubar: false,
          placeholder,
          plugins: ['lists', 'link', 'autolink'],
          toolbar: 'undo redo | bold italic underline | bullist numlist | link | removeformat',
          // Security: Only allow safe HTML elements
          valid_elements: 'p,br,strong/b,em/i,u,ul,ol,li,a[href|target|rel],span,h1,h2,h3,h4,h5,h6',
          // Security: Block dangerous elements
          invalid_elements: 'script,iframe,object,embed,form,input,button,textarea,select',
          // Security: Safe link attributes only
          extended_valid_elements: 'a[href|target=_blank|rel=noopener noreferrer]',
          // Security: Convert unsafe embeds
          convert_unsafe_embeds: true,
          // Security: Sandbox any iframes (if they somehow get through)
          sandbox_iframes: true,
          // Force safe link behavior
          link_default_target: '_blank',
          link_assume_external_targets: true,
          // Default rel attribute for security
          link_default_protocol: 'https',
          // Styling
          content_style: `
            body { 
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; 
              font-size: 14px; 
              line-height: 1.6;
              color: #333;
              padding: 8px;
            }
            p { margin: 0 0 10px 0; }
            ul, ol { margin: 0 0 10px 0; padding-left: 20px; }
            a { color: #2563eb; text-decoration: underline; }
          `,
          branding: false,
          promotion: false,
          // Paste security: strip potentially dangerous content
          paste_as_text: false,
          paste_data_images: false,
          paste_remove_styles_if_webkit: true,
          paste_strip_class_attributes: 'all',
          // Self-hosted skin and content paths
          skin: false,
          content_css: false,
        }}
      />
    </div>
  );
};

export { SANITIZE_CONFIG };
