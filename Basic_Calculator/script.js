document.addEventListener('DOMContentLoaded', function () {
    const display = document.getElementById('display');
    let currentInput = ''; 
    let memory = 0;
    let isParenthesisOpen = false; 

    document.querySelectorAll('.btn').forEach(button => {
        button.addEventListener('click', function () {
            const action = button.getAttribute('data-action');
            const value = button.getAttribute('data-value');

            handleButtonPress(action, value);
        });
    });

    document.addEventListener('keydown', function (event) {
        const key = event.key;

        if (key === 'Backspace') {
            handleButtonPress('backspace');
        } else if (key === 'Enter' || key === '=') {
            handleButtonPress('calculate');
        } else if (key === 'Escape') {
            handleButtonPress('clear');
        } else if (key === '(' || key === ')') {
            handleButtonPress('parenthesis');
        } else if (key === 'm' || key === 'M') {
            handleMemoryOperations(key);
        } else {
            const keyMap = {
                '0': '0', '1': '1', '2': '2', '3': '3', '4': '4',
                '5': '5', '6': '6', '7': '7', '8': '8', '9': '9',
                '.': '.', '+': '+', '-': '-', '*': '×', '/': '÷',
                '%': '%', 's': 'sqrt' 
            };
            if (keyMap[key]) {
                handleButtonPress(null, keyMap[key]);
            }
        }
    });

    function handleButtonPress(action, value) {
        if (action === 'clear') {
            currentInput = ''; // Clear the display
            updateDisplay();
        } else if (action === 'calculate') {
            try {
        currentInput = currentInput.replace(/(\d|\))\s*\(/g, '$1*(');
        currentInput = currentInput.replace(/\)\s*(\d)/g, ')*$1');

        currentInput = currentInput.replace(/(\d+)%\s*\(/g, '($1/100)*(');
        currentInput = currentInput.replace(/(\d+)%/g, '($1/100)');

                if (currentInput.includes('%')) {
                    currentInput = currentInput.replace(/(\d+)%/g, (match, p1) => {
                        return (parseFloat(p1) / 100).toString();
                    });
                }

                currentInput = eval(currentInput.replace('÷', '/').replace('×', '*')); 
                updateDisplay();
            } catch (e) {
                currentInput = 'Error'; 
                updateDisplay();
            }
        } else if (action === 'backspace') {
            currentInput = currentInput.slice(0, -1); 
            updateDisplay();
        } else if (action === 'memory-clear') {
            memory = 0; 
        } else if (action === 'memory-recall') {
            currentInput = memory.toString(); 
            updateDisplay();
        } else if (action === 'memory-add') {
            memory += parseFloat(currentInput) || 0; 
            currentInput = '';
            updateDisplay();
        } else if (action === 'memory-subtract') {
            memory -= parseFloat(currentInput) || 0;
            currentInput = '';
            updateDisplay();
        } else if (action === 'sqrt') {
            currentInput = Math.sqrt(parseFloat(currentInput) || 0).toString(); 
            updateDisplay();
        } else if (action === 'parenthesis') {
            if (isParenthesisOpen) {
                currentInput += ')';
                isParenthesisOpen = false;
            } else {
                currentInput += '(';
                isParenthesisOpen = true;
            }
            updateDisplay();
        } else if (value) {
            currentInput += value; 
            updateDisplay();
        }
    }

    function handleMemoryOperations(key) {
        if (key === 'm' || key === 'M') {
            const memoryAction = prompt("Enter memory action (MC, MR, M+, M-):").toUpperCase();

            if (memoryAction === 'MC') {
                memory = 0; // Clear memory
            } else if (memoryAction === 'MR') {
                currentInput = memory.toString(); // Recall memory
                updateDisplay();
            } else if (memoryAction === 'M+') {
                memory += parseFloat(currentInput) || 0; 
                currentInput = '';
                updateDisplay();
            } else if (memoryAction === 'M-') {
                memory -= parseFloat(currentInput) || 0; 
                currentInput = '';
                updateDisplay();
            }
        }
    }
    function updateDisplay() {
        display.value = currentInput;
    }
});
