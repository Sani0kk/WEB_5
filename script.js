// Функція для переключення вкладок
function openTab(tabId) {
    // Сховати всі вкладки
    const tabContents = document.getElementsByClassName('tab-content');
    for (let i = 0; i < tabContents.length; i++) {
        tabContents[i].classList.remove('active');
    }
    
    // Видалити активний клас з усіх кнопок
    const tabButtons = document.getElementsByClassName('tab-button');
    for (let i = 0; i < tabButtons.length; i++) {
        tabButtons[i].classList.remove('active');
    }
    
    // Показати вибрану вкладку і зробити кнопку активною
    document.getElementById(tabId).classList.add('active');
    event.currentTarget.classList.add('active');
}

// Функція для порівняння надійності систем
function compareReliability() {
    // Отримання даних для одноколової системи
    const breakerFreq = parseFloat(document.getElementById('breaker-freq').value);
    const lineFreqPerKm = parseFloat(document.getElementById('line-freq').value);
    const lineLength = parseFloat(document.getElementById('line-length').value);
    const transformerFreq = parseFloat(document.getElementById('transformer-freq').value);
    const inputBreakerFreq = parseFloat(document.getElementById('input-breaker-freq').value);
    const connectionsFreq = parseFloat(document.getElementById('connections-freq').value);
    const connectionsCount = parseInt(document.getElementById('connections-count').value);
    
    // Отримання даних для двоколової системи
    const sectionBreakerFreq = parseFloat(document.getElementById('section-breaker-freq').value);
    
    // Частота відмов одноколової системи
    const lineFreq = lineFreqPerKm * lineLength;
    const connectionsTotalFreq = connectionsFreq * connectionsCount;
    const omegaOC = breakerFreq + lineFreq + transformerFreq + inputBreakerFreq + connectionsTotalFreq;
    
    // Середня тривалість відновлення (спрощений підхід)
    const tBOC = 10.7; // год (з прикладу 3.1)
    
    // Коефіцієнт аварійного простою одноколової системи
    const kaOC = (omegaOC * tBOC) / 8760;
    
    // Коефіцієнт планового простою (спрощений підхід)
    const knOC = 1.2 * (43 / 8760); // 43 год - найбільше значення для трансформатора
    
    // Розрахунок для двоколової системи
    const omegaDK = 2 * omegaOC * (kaOC + 0.5 * knOC);
    const omegaDC = omegaDK + sectionBreakerFreq;
    const tBDC = tBOC / 2; // Приблизно вдвічі менше для двоколової системи
    const kaDC = (omegaDC * tBDC) / 8760;
    
    // Формування результату
    let resultHTML = `
        <h3>Результати порівняння надійності:</h3>
        <table>
            <tr>
                <th>Показник</th>
                <th>Одноколова система</th>
                <th>Двоколова система</th>
            </tr>
            <tr>
                <td>Частота відмов, рік⁻¹</td>
                <td>${omegaOC.toFixed(4)}</td>
                <td>${omegaDC.toFixed(4)}</td>
            </tr>
            <tr>
                <td>Коефіцієнт аварійного простою</td>
                <td>${kaOC.toExponential(4)}</td>
                <td>${kaDC.toExponential(4)}</td>
            </tr>
            <tr>
                <td>Коефіцієнт планового простою</td>
                <td>${knOC.toExponential(4)}</td>
                <td>~0</td>
            </tr>
        </table>
        <p><strong>Висновок:</strong> Двоколова система має значно вищу надійність порівняно з одноколовою.</p>
    `;
    
    document.getElementById('reliability-result').innerHTML = resultHTML;
}

// Функція для розрахунку збитків від перерв електропостачання
function calculateDamages() {
    // Отримання вхідних даних
    const transformerFailureRate = parseFloat(document.getElementById('transformer-failure-rate').value);
    const repairTime = parseFloat(document.getElementById('repair-time').value);
    const plannedOutageCoeff = parseFloat(document.getElementById('planned-outage-coeff').value);
    const maxLoad = parseFloat(document.getElementById('max-load').value);
    const usageHours = parseFloat(document.getElementById('usage-hours').value);
    const emergencyDamage = parseFloat(document.getElementById('emergency-damage').value);
    const plannedDamage = parseFloat(document.getElementById('planned-damage').value);
    
    // Розрахунок математичного сподівання недовідпущень
    const M_W_emergency = transformerFailureRate * (repairTime / 8760) * maxLoad * usageHours;
    const M_W_planned = plannedOutageCoeff * maxLoad * usageHours;
    
    // Розрахунок математичного сподівання збитків
    const M_damages = emergencyDamage * M_W_emergency + plannedDamage * M_W_planned;
    
    // Формування результату
    let resultHTML = `
        <h3>Результати розрахунку збитків:</h3>
        <p><strong>Математичне сподівання аварійного недовідпущення електроенергії:</strong> ${M_W_emergency.toFixed(2)} кВт·год</p>
        <p><strong>Математичне сподівання планового недовідпущення електроенергії:</strong> ${M_W_planned.toFixed(2)} кВт·год</p>
        <p><strong>Математичне сподівання збитків від переривання електропостачання:</strong> ${M_damages.toFixed(2)} грн</p>
    `;
    
    document.getElementById('damages-result').innerHTML = resultHTML;
}