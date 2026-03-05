const fs = require('fs');
const path = require('path');

const filePath = path.join(
  __dirname,
  '../node_modules/react-native/src/private/specs_DEPRECATED/components/DebuggingOverlayNativeComponent.js'
);

if (fs.existsSync(filePath)) {
  let content = fs.readFileSync(filePath, 'utf8');

  // Remove problematic array-based commands from NativeCommands interface
  content = content.replace(
    /interface NativeCommands \{[\s\S]*?\+clearElementsHighlights: \([^)]*\) => void;\s*\}/,
    `interface NativeCommands {
  +clearElementsHighlights: (
    viewRef: React.ElementRef<DebuggingOverlayNativeComponentType>,
  ) => void;
}`
  );

  // Ensure supportedCommands only has clearElementsHighlights
  content = content.replace(
    /supportedCommands: \[\s*'[^']*',\s*'[^']*',\s*'[^']*',?\s*\]/,
    "supportedCommands: [\n    'clearElementsHighlights',\n  ]"
  );

  fs.writeFileSync(filePath, content, 'utf8');
  console.log('✓ Patched DebuggingOverlayNativeComponent.js');
} else {
  console.log('DebuggingOverlayNativeComponent.js not found (might be in a different RN version)');
}
