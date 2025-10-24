class OpenDailyNote {
    open() {
        // Try to use the Periodic Notes plugin API if available
        const periodicNotes = app.plugins.plugins['periodic-notes'];
        if (periodicNotes && periodicNotes.api && periodicNotes.api.openDailyNote) {
            periodicNotes.api.openDailyNote();
        } else {
            // Fallback: use the command
            app.commands.executeCommandById('periodic-notes:open-daily-note');
        }
    }
}