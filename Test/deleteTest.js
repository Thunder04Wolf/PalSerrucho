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
            await driver.get('http://127.0.0.1:5500/index.html');

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

            console.log('Esperando a que cargue el primer botón "delete" en una celda...');
            await driver.wait(until.elementLocated(By.css('td button.delete-button')), 10000);
            let deleteButtons = await driver.findElements(By.css('td button.delete-button'));
            assert(deleteButtons.length > 0); // Verifica que existen botones de delete
            
            // Hacer clic en el primer botón de delete
            await driver.wait(until.elementIsVisible(deleteButtons[0]), 10000);
            await deleteButtons[0].click();

            console.log('Esperando el modal de confirmación de eliminación...');
            const modalContent = await driver.wait(until.elementLocated(By.css('.modal-content')), 10000);
            await driver.wait(until.elementIsVisible(modalContent), 10000);

            console.log('Confirmando la eliminación...');
            const confirmDeleteButton = await driver.findElement(By.id('confirmDeleteButton'));
            await driver.wait(until.elementIsVisible(confirmDeleteButton), 10000);
            await confirmDeleteButton.click();

            console.log('Esperando a que la página se actualice después de la eliminación...');
            await driver.wait(until.stalenessOf(deleteButtons[0]), 10000); // Esperar que el botón de eliminar ya no esté en la página

            console.log('Eliminación completada con éxito');
        } catch (error) {
            console.error('Se produjo un error:', error);
            await takeScreenshot('error_screenshot');
            throw error; // Relanzar el error para que Mocha lo registre
        }

        let endTime = new Date();
        let elapsedTime = endTime - startTime;
        console.log(`Tiempo de prueba: ${elapsedTime} ms`);
    });
});
