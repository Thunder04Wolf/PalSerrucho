const { Builder, By, until } = require('selenium-webdriver');
const assert = require('assert');
const fs = require('fs');
const path = require('path');

describe('Login Test', function() {
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

    it('should log in successfully', async function() {
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

            // Asegúrate de agregar más pasos aquí para verificar el éxito del inicio de sesión
            // Ejemplo: Verifica si el usuario fue redirigido a la página principal o a un dashboard
            console.log('Esperando a que la página principal cargue después del login...');
            await driver.wait(until.elementLocated(By.css('header.custom-header')), 10000); // Asegúrate de que el header esté visible como prueba de que se ha iniciado sesión correctamente

            console.log('Inicio de sesión exitoso.');

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
