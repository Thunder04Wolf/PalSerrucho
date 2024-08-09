const { Builder, By, until } = require('selenium-webdriver');
const assert = require('assert');
const fs = require('fs');
const path = require('path');

describe('Register Test', function() {
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

    it('should register a new user successfully', async function() {
        let startTime = new Date();

        try {
            console.log('Navegando a la página web...');
            await driver.get('http://127.0.0.1:5500/index.html');

            console.log('Haciendo clic en el botón de Login...');
            await driver.wait(until.elementIsVisible(driver.findElement(By.css('button.btnLogin-popup'))), 10000);
            await driver.findElement(By.css('button.btnLogin-popup')).click();

            console.log('Haciendo clic en el enlace de registro...');
            await driver.wait(until.elementIsVisible(driver.findElement(By.css('a.register-link'))), 10000);
            await driver.findElement(By.css('a.register-link')).click();

            console.log('Ingresando el nombre de usuario...');
            await driver.wait(until.elementIsVisible(driver.findElement(By.id('registerUsername'))), 10000);
            await driver.findElement(By.id('registerUsername')).sendKeys('Pedro');

            console.log('Ingresando el correo electrónico...');
            await driver.wait(until.elementIsVisible(driver.findElement(By.id('registerEmail'))), 10000);
            await driver.findElement(By.id('registerEmail')).sendKeys('pa.garcia3001@gmail.com');

            console.log('Ingresando la contraseña...');
            await driver.wait(until.elementIsVisible(driver.findElement(By.id('registerPassword'))), 10000);
            await driver.findElement(By.id('registerPassword')).sendKeys('123456');

            console.log('Confirmando la contraseña...');
            await driver.wait(until.elementIsVisible(driver.findElement(By.id('registerPasswordRepeat'))), 10000);
            await driver.findElement(By.id('registerPasswordRepeat')).sendKeys('123456');

            
            

            console.log('Haciendo clic en el botón de Registro...');
            await driver.wait(until.elementIsVisible(driver.findElement(By.css('button.btn-register'))), 10000);
            await driver.findElement(By.css('button.btn-register')).click();

            // Asegúrate de agregar más pasos aquí para verificar el éxito del registro
            console.log('Registro exitoso.');

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
