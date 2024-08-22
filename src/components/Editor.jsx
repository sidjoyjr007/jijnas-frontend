import { useState, useEffect } from "react";
import "froala-editor/css/froala_style.min.css";
import "froala-editor/css/froala_editor.pkgd.min.css";
import "froala-editor/js/plugins.pkgd.min.js";
import "froala-editor/js/plugins/lists.min.js";
import AlertDialog from "./AlertDilaog";

import FroalaEditorComponent from "react-froala-wysiwyg";

const config = {
  moreText: {
    buttons: [
      "bold",
      "italic",
      "underline",
      "formatOL",
      "formatUL",
      "strikeThrough",
      "subscript",
      "superscript",
      "fontFamily",
      "fontSize",
      "textColor",
      "backgroundColor",
      "inlineClass",
      "inlineStyle",
      "clearFormatting"
    ],

    buttonsVisible: 5
  },

  moreParagraph: {
    buttons: [
      "alignLeft",
      "alignCenter",
      "alignRight",
      "alignJustify",
      "paragraphFormat",
      "paragraphStyle",
      "lineHeight",
      "outdent",
      "indent",
      "quote"
    ],
    buttonsVisible: 0
  },

  moreRich: {
    buttons: [
      "insertLink",
      "insertImage",
      "insertTable",
      "emoticons",
      "fontAwesome",
      "specialCharacters",
      "embedly",
      "insertHR"
    ]
  },

  moreMisc: {
    buttons: ["undo", "redo", "spellChecker", "selectAll", "help"],

    align: "right",

    buttonsVisible: 2
  }
};
const Editor = ({ model, setModel, type = "" }) => {
  const [dialogData, setDialogData] = useState({});
  useEffect(() => {
    // Function to remove the parent div of the selected elements
    const maskElement = (elements) => {
      elements.forEach((element) => {
        const parentDiv = element.closest("div"); // Find the closest parent div
        if (parentDiv) {
          parentDiv.remove(); // Remove the parent div from the DOM
        }
      });
    };

    // Function to observe changes in the DOM
    const observeDOMChanges = (selector) => {
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === 1) {
              const matchingElements = node.querySelectorAll(selector);
              maskElement(Array.from(matchingElements));
            }
          });
        });
      });

      observer.observe(document.body, {
        childList: true,
        subtree: true
      });

      // Initial check in case the elements are already present
      const initialElements = document.querySelectorAll(selector);
      if (initialElements.length > 0) {
        maskElement(Array.from(initialElements));
      }

      // Cleanup function to disconnect the observer when the component unmounts
      return () => observer.disconnect();
    };

    // Use the appropriate selector to match any href containing "froala.com"
    const selector = 'a[href*="froala.com"]';

    // Start observing
    const disconnectObserver = observeDOMChanges(selector);

    // Cleanup function to disconnect the observer when the component unmounts
    return () => {
      disconnectObserver();
    };
  }, []);

  const onAlertDialogClose = () => {
    setDialogData({ show: false });
  };
  return (
    <>
      <FroalaEditorComponent
        tag="textarea"
        config={{
          placeholderText: "Start writing...",
          toolbarButtons: config,
          theme: "dark",
          spellcheck: true,
          pasteAllowedStyleProps: [],
          quickInsertTags: [],
          listAdvancedTypes: true,

          events: {
            "image.beforeUpload": function (files) {
              var editor = this;
              if (files.length) {
                const fileSize = files[0]?.size;
                if (fileSize / 1024 > 100) {
                  setDialogData({
                    show: true,
                    msgHeader: "Image size exceeded",
                    msg: "Application supports images size max up to 100kb, if needed please compress and upload"
                  });
                  return false;
                }
                // Create a File Reader.
                var reader = new FileReader();
                // Set the reader to insert images when they are loaded.
                reader.onload = function (e) {
                  var result = e.target.result;
                  editor.image.insert(result, null, null, editor.image.get());
                };
                // Read image as base64.
                reader.readAsDataURL(files[0]);
              }
              editor.popups.hideAll();
              // Stop default upload chain.
              return false;
            },
            contentChanged: function () {
              // Do something here.
              // this is the editor instance.
            }
          }
        }}
        model={model}
        onModelChange={(event) => setModel(event, type)}
      />
      {dialogData?.show && (
        <AlertDialog
          show={dialogData?.show}
          msgHeader={dialogData?.msgHeader}
          msg={dialogData?.msg}
          onClose={() => onAlertDialogClose()}
        />
      )}
    </>
  );
};

export default Editor;
