# Claude Code Notification Badges Setup Guide

This guide will help you configure notification badges for Claude Code on macOS, so you get notified when Claude completes tasks or long-running operations.

## Prerequisites

### 1. Install terminal-notifier

```bash
brew install terminal-notifier
```

Verify installation:
```bash
which terminal-notifier
```

Expected output: `/opt/homebrew/bin/terminal-notifier` (or `/usr/local/bin/terminal-notifier` on Intel Macs)

## Setup Steps

### Step 1: Configure Claude Code Settings

Edit or create `~/.claude/settings.json`:

```json
{
  "hooks": {
    "Notification": [
      {
        "matcher": "",
        "hooks": [
          {
            "type": "command",
            "command": "jq -r '.message' | xargs -I {} /opt/homebrew/bin/terminal-notifier -message \"{}\" -title \"Claude Code\" -group \"$(pwd):claude\" -sound default"
          }
        ]
      }
    ]
  },
  "permissions": {
    "allow": [
      "Bash(terminal-notifier:*)"
    ]
  }
}
```

**Note for Intel Macs:** Replace `/opt/homebrew/bin/terminal-notifier` with `/usr/local/bin/terminal-notifier`

**If you have existing settings:** Merge the `hooks` and `permissions` sections with your current configuration, preserving other settings.

### Step 2: Create Claude Instructions File

Create `~/.claude/CLAUDE.md`:

```markdown
# Claude Code Instructions

## Notifications

After completing tasks, display notifications using terminal-notifier with a descriptive title and message. Group notifications by the present working directory to keep them organized.

Example notification command:
\`\`\`bash
/opt/homebrew/bin/terminal-notifier -message "Task completed successfully" -title "Claude Code" -group "$(pwd):claude" -sound default
\`\`\`

Use notifications to inform about:
- Task completion
- Build results
- Test execution results
- Any long-running operations that finish
```

### Step 3: Configure macOS Notification Settings

1. Open **System Settings** (or **System Preferences** on older macOS)
2. Navigate to **Notifications**
3. Scroll down and find **terminal-notifier** in the application list
4. Click on it and configure:
   - ✅ **Allow notifications**
   - Set **Alert style** to **Alerts** (these persist until dismissed)
     - _Don't use "Banners" as they auto-dismiss after a few seconds_
   - ✅ Enable **Sound** (optional but recommended)
   - ✅ Enable **Show in Notification Center** (optional)

## Testing

### Test 1: Manual Notification

Run this command in your terminal:

```bash
/opt/homebrew/bin/terminal-notifier -message "Test notification" -title "Claude Code" -group "$(pwd):claude" -sound default
```

You should see a notification appear.

### Test 2: Claude-Triggered Notification

1. Start a new Claude Code session
2. Ask Claude to perform a task, like: "Run a simple build command and notify me when done"
3. When Claude completes the task, you should receive a notification

## Configuration Breakdown

### What each part does:

- **`hooks.Notification`**: Intercepts notification events from Claude
- **`jq -r '.message'`**: Extracts the notification message from JSON
- **`terminal-notifier`**: macOS notification tool
  - `-message`: The notification body text
  - `-title`: Notification title (appears bold)
  - `-group`: Groups notifications by directory (prevents spam)
  - `-sound`: Plays a sound when notification appears

### Permissions

The `permissions.allow` section grants Claude permission to execute `terminal-notifier` without asking for approval each time.

## Troubleshooting

### Notifications not appearing?

1. **Check terminal-notifier installation:**
   ```bash
   which terminal-notifier
   /opt/homebrew/bin/terminal-notifier --version
   ```

2. **Verify the path in settings.json matches your installation:**
   - Apple Silicon (M1/M2/M3): `/opt/homebrew/bin/terminal-notifier`
   - Intel Mac: `/usr/local/bin/terminal-notifier`

3. **Check macOS notification permissions:**
   - System Settings → Notifications → terminal-notifier
   - Ensure notifications are enabled

4. **Check Do Not Disturb mode:**
   - Notifications won't appear if DND is enabled
   - Check menu bar or Control Center

### Notifications disappear too quickly?

Make sure notification style is set to **Alerts**, not **Banners** in System Settings → Notifications → terminal-notifier.

### Permission errors?

Ensure `permissions.allow` includes `"Bash(terminal-notifier:*)"` in your settings.json.

## Advanced Configuration

### Custom notification sound

Replace `default` with any macOS system sound name:
```bash
-sound "Glass"
```

Available sounds are in `/System/Library/Sounds/`.

### Different notification grouping

Change the group identifier:
```bash
-group "claude-$(date +%Y%m%d)"  # Group by date
-group "claude"                    # Single group for all notifications
```

### WezTerm Integration (Optional)

If you use WezTerm terminal, you can make notifications clickable to activate the terminal pane:

```json
{
  "hooks": {
    "Notification": [
      {
        "matcher": "",
        "hooks": [
          {
            "type": "command",
            "command": "jq -r '.message' | xargs -I {} terminal-notifier -message \"{}\" -title \"Claude Code\" -group \"$(pwd):claude\" -execute \"/opt/homebrew/bin/wezterm cli activate-pane --pane-id $WEZTERM_PANE\" -activate com.github.wez.wezterm"
          }
        ]
      }
    ]
  }
}
```

This requires WezTerm to be installed: `brew install wezterm`

## Reference

- Original guide: [Directed Notifications for Claude Code Async Programming](https://www.joshbeckman.org/blog/practicing/directed-notifications-for-claude-code-async-programming)
- [terminal-notifier GitHub](https://github.com/julienXX/terminal-notifier)
- [Claude Code Documentation](https://docs.claude.com/claude-code)

## Credits

Setup based on the excellent guide by Josh Beckman.
