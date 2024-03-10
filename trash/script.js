function extractStylesFromString(cssString) {
    const ast = csstree.parse(cssString);
    
    csstree.walk(ast, function(node) {
        if (node.type === 'Rule') {
            node.block.children.forEach(declaration => {
                if (declaration.type === 'Declaration') {
                    if (declaration.property === 'color' && declaration.value) {
                        stylesUsed.colors[declaration.value] = true;
                    } else if (declaration.property === 'font-size' && declaration.value) {
                        stylesUsed.fontSizes[declaration.value] = true;
                    }
                }
            });
        }
    });
}

// Usage
const cssString = `
    body {
        color: #333;
        font-size: 16px;
    }
    h1 {
        color: #ff0000;
        font-size: 24px;
    }
    /* Add more CSS rules here */
`;

extractStylesFromString(cssString);



// Convert RGB color to hexadecimal format
function rgbToHex(rgb) {
    const match = rgb.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
    if (match) {
        return "#" + ((1 << 24) + (parseInt(match[1]) << 16) + (parseInt(match[2]) << 8) + parseInt(match[3])).toString(16).slice(1);
    }
    return rgb;
}

// Generate new CSS with variables
function generateNewCSS() {
    let newCSS = '';
    let index = 1;

    // Colors
    for (const color in stylesUsed.colors) {
        newCSS += `:root { --color${index++}: ${color}; }\n`;
    }

    // Font sizes
    index = 1;
    for (const fontSize in stylesUsed.fontSizes) {
        newCSS += `:root { --fontSize${index++}: ${fontSize}; }\n`;
    }

    // Replace old styles with variables in original CSS
    for (let i = 0; i < styleSheets.length; i++) {
        const rules = styleSheets[i].cssRules;
        if (rules) {
            for (let j = 0; j < rules.length; j++) {
                const rule = rules[j];
                if (rule.style) {
                    // Replace colors
                    newCSS += rule.cssText.replace(/color:([^;]+)/g, (_, color) => {
                        if (color) {
                            color = rgbToHex(color.trim());
                            console.log(color)
                            console.log(stylesUsed.colors[color])
                            if (stylesUsed.colors[color]) {
                                return `color: var(--color${Object.keys(stylesUsed.colors).indexOf(color) + 1})`;
                            }
                        }
                        return `color: ${color}`;
                    }) + '\n';

                    // Replace font sizes
                    newCSS = newCSS.replace(/font-size:([^;]+)/g, (_, fontSize) => {
                        if (fontSize && stylesUsed.fontSizes[fontSize.trim()]) {
                            return `font-size: var(--fontSize${Object.keys(stylesUsed.fontSizes).indexOf(fontSize.trim()) + 1})`;
                        }
                        return `font-size: ${fontSize}`;
                    });
                }
            }
        }
    }
    return newCSS;
}


// Apply new CSS
function applyNewCSS(css) {
    const style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);
}

// Function to remove excess :root selectors from CSS
function removeExcessRootSelectors(css) {
    let rootCount = 0;
    const lines = css.split('\n');
    let newCSS = '';
    for (const line of lines) {
        if (line.trim().startsWith(':root')) {
            if (rootCount === 0) {
                newCSS += line + '\n';
            }
            rootCount++;
        } else {
            newCSS += line + '\n';
        }
    }
    return newCSS;
}



// Your JavaScript code goes here...
function appendCSSVariables(css) {
    const rootIndex = css.indexOf(':root');
    if (rootIndex !== -1) {
        const rootEndIndex = css.indexOf('}', rootIndex);
        if (rootEndIndex !== -1) {
            const rootContent = css.substring(rootIndex + ':root'.length, rootEndIndex);
            let newCSS = css.substring(0, rootEndIndex);
            let index = 1;

            // Append new CSS variables under :root
            for (const color in stylesUsed.colors) {
                newCSS += `\n  --color${index++}: ${color};`;
            }

            index = 1;
            for (const fontSize in stylesUsed.fontSizes) {
                newCSS += `\n  --fontSize${index++}: ${fontSize};`;
            }

            newCSS += css.substring(rootEndIndex);
            return newCSS;
        }
    }
    return css;
}
// Function to load CSS file asynchronously
function loadCSSFile(url, callback) {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            callback(xhr.responseText);
        }
    };
    xhr.send();
}

// Usage
cssfile = 'https://cdn.jsdelivr.net/npm/fomantic-ui@2.9.3/dist/semantic.css'
cssfile = 'style.css'
loadCSSFile(cssfile, function (css) {
    extractStylesFromString(css);
    let newCSS = generateNewCSS(css);
    newCSS = appendCSSVariables(newCSS)
    newCSS = removeExcessRootSelectors(newCSS);
    var prettifiedCSS = cssbeautify(newCSS);
    console.log(prettifiedCSS)
    applyNewCSS(prettifiedCSS);
});