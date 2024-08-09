const { Builder, By, until } = require('selenium-webdriver');
const assert = require('assert');
const fs = require('fs');
const path = require('path');

describe('Automated Task Test', function() {
    this.timeout(30000); // Tiempo máximo de espera para cada prueba en ms

    let driver;

    before(async function() {
        driver = await new Builder().forBrowser('chrome').build();
    });

    after(async function() {
        // Captura de pantalla al finalizar la prueba (si se necesita)
        await takeScreenshot('after_test');
        await driver.quit();
    });

    async function takeScreenshot(name) {
        const screenshot = await driver.takeScreenshot();
        const filePath = path.join(__dirname, `${name}.png`);
        fs.writeFileSync(filePath, screenshot, 'base64');
        console.log(`Captura de pantalla guardada en ${filePath}`);
    }

    it('should complete the task successfully', async function() {
        let startTime = new Date();

        try {
            console.log('Navegando a la página web...');
            await driver.get('http://127.0.0.1:5500/HTML/Login.html');

            console.log('Haciendo clic en el botón de Login...');
            await driver.wait(until.elementIsVisible(driver.findElement(By.css('button.btnLogin-popup'))), 10000);
            await driver.findElement(By.css('button.btnLogin-popup')).click();

            console.log('Ingresando el email...');
            await driver.wait(until.elementIsVisible(driver.findElement(By.id('emailInput'))), 10000);
            await driver.findElement(By.id('emailInput')).sendKeys('pa.garcia1001@gmail.com');

            console.log('Ingresando la contraseña...');
            await driver.wait(until.elementIsVisible(driver.findElement(By.id('passwordInput'))), 10000);
            await driver.findElement(By.id('passwordInput')).sendKeys('123456');

            console.log('Haciendo clic en el botón de Login...');
            await driver.findElement(By.css('button.btn')).click();

            console.log('Esperando a que cargue el primer botón "Editar" en una celda...');
            await driver.wait(until.elementLocated(By.css('td button.edit-button')), 10000);
            let editButtons = await driver.findElements(By.css('td button.edit-button'));
            assert(editButtons.length > 0); // Verifica que existen botones de editar
            await driver.wait(until.elementIsVisible(editButtons[0]), 10000);
            await editButtons[0].click();

            console.log('Esperando a que cargue el input de cantidad...');
            await driver.wait(until.elementIsVisible(driver.findElement(By.id('editAmount'))), 10000);
            let amountInput = await driver.findElement(By.id('editAmount'));

            // Limpia el campo de monto antes de ingresar el nuevo valor
            await amountInput.clear();
            await amountInput.sendKeys('680');

            console.log('Esperando a que cargue el input de descripción y digitación...');
            await driver.wait(until.elementIsVisible(driver.findElement(By.id('editDescription'))), 10000);
            await driver.findElement(By.id('editDescription')).sendKeys('Realizando el test');

            console.log('Seleccionando una fecha en el datepicker...');
            await driver.findElement(By.id('editDate')).sendKeys('2024-08-08');

            console.log('Haciendo clic en el botón de "Actualizar Gasto"...');
            await driver.findElement(By.css('button.btn')).click();

            console.log('Test completado con éxito.');

        } catch (error) {
            console.error('Se produjo un error:', error);
            await takeScreenshot('error_screenshot');
            throw error; // Propaga el error para que Mocha lo registre
        } finally {
            let endTime = new Date();
            let duration = (endTime - startTime) / 1000; // Duración en segundos
            console.log(`Test completado en ${duration} segundos.`);
        }
    });
});
