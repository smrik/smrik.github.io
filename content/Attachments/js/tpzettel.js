module.exports = async (tp) => {
  // Get the current active file (the source file with the selection)
  const sourceFile = app.workspace.getActiveFile();
  
  if (!sourceFile) {
    new Notice("No active file found.");
    return "";
  }
  
  const sourceNote = sourceFile.basename;
  
  // Get the active editor
  const activeLeaf = app.workspace.activeLeaf;
  if (!activeLeaf || !activeLeaf.view || !activeLeaf.view.editor) {
    new Notice("No active editor found.");
    return "";
  }
  
  const sourceEditor = activeLeaf.view.editor;
  
  // Check if text is selected
  if (!sourceEditor.somethingSelected()) {
    new Notice("No text selected.");
    return "";
  }
  
  // Get the selected text WITHOUT replacing it
  const selectedText = sourceEditor.getSelection();
  
  // Get cursor end position AFTER the selection
  const cursorEnd = sourceEditor.getCursor("to");
  
  // IMPORTANT: Clear the selection so Templater doesn't replace it
  sourceEditor.setCursor(cursorEnd);
  
  // Prompt for the new note title
  const title = await tp.system.prompt("Enter the title of the new Zettelkasten note:");

  if (!title) {
    new Notice("Note creation cancelled.");
    return "";
  }

  // Get current date and time
  const currentDate = tp.date.now("YYYY-MM-DD");
  const currentTime = tp.date.now("HH:mm");

  // Prepare the content for the new Zettelkasten note
  const content = `---
Created: ${currentDate}T${currentTime}
Type: Fun Fact
tags:
Links:
---

## ${title}


> ${selectedText}


---
#### Related Concepts
- 

#### Source
- [[${sourceNote}|Original Source]]
-
`;

  // Create the new note in Zettelkasten folder
  const newFile = await tp.file.create_new(content, title, false, "Zettelkasten");
  
  // Insert backlink in the source file right after the selected text
  sourceEditor.replaceRange(`\n\n[[${title}]]`, cursorEnd);
  
  // Open the new Zettelkasten note in a new tab
  const newLeaf = app.workspace.getLeaf('tab');
  await newLeaf.openFile(newFile);
  
  // Return empty string so nothing gets inserted in the current file
  return "";
};
