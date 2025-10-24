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
  
  // Get cursor end position
  const cursorEnd = sourceEditor.getCursor("to");
  
  // IMPORTANT: Clear the selection so Templater doesn't replace it with the return value
  sourceEditor.setCursor(cursorEnd);
  
  // Get all files in Zettelkasten folder
  const zettelFolder = "Zettelkasten";
  const zettelFiles = app.vault.getMarkdownFiles().filter(file => 
    file.path.startsWith(zettelFolder)
  );
  
  if (zettelFiles.length === 0) {
    new Notice("No Zettelkasten notes found.");
    return "";
  }
  
  // Show suggester to select which Zettelkasten note to append to
  const selectedZettel = await tp.system.suggester(
    (file) => file.basename, 
    zettelFiles,
    false,
    "Select Zettelkasten note to append to:"
  );
  
  if (!selectedZettel) {
    new Notice("No note selected.");
    return "";
  }
  
  // Get current date and time
  const currentDate = tp.date.now("YYYY-MM-DD");
  const currentTime = tp.date.now("HH:mm");
  
  // Prepare content to append
  const appendContent = `

---
### Added: ${currentDate}T${currentTime}

> ${selectedText}

#### Source
- [[${sourceNote}|Original Source]]

`;
  
  // Read the file content and insert before "Related Concepts" section
  await app.vault.process(selectedZettel, (data) => {
    // Find the position of "---" followed by "#### Related Concepts"
    const relatedConceptsPattern = /\n---\n#### Related Concepts/;
    const match = data.match(relatedConceptsPattern);
    
    if (match) {
      // Insert before the "---\n#### Related Concepts" section
      const insertPosition = match.index;
      return data.slice(0, insertPosition) + appendContent + data.slice(insertPosition);
    } else {
      // If pattern not found, append to the end
      return data + appendContent;
    }
  });
  
  // Insert backlink in the source file
  sourceEditor.replaceRange(`\n\n[[${selectedZettel.basename}]]`, cursorEnd);
  
  // Open the updated Zettelkasten note in a new tab
  const newLeaf = app.workspace.getLeaf('tab');
  await newLeaf.openFile(selectedZettel);
  
  new Notice(`Appended to ${selectedZettel.basename}`);
  
  // Return empty string so nothing gets inserted
  return "";
};
