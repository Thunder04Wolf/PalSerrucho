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

    it('should log in, navigate to Pagos, and fill the form successfully', async function() {
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

            console.log('Esperando a que se complete el login y se cargue la página...');
            // Espera a que un elemento clave esté visible, como el campo de monto en la página de pagos
            await driver.wait(until.elementLocated(By.css('a#amount')), 10000); // Espera a que el enlace "Pagos" esté visible

            console.log('Haciendo clic en el enlace "Pagos"...');
            const pagosLink = await driver.findElement(By.css('a#amount'));
            await pagosLink.click();

            console.log('Esperando a que cargue el formulario de pagos...');
            await driver.wait(until.elementLocated(By.css('input#amount')), 10000); // Asegúrate de que el campo de monto esté visible

            console.log('Llenando el campo "Monto"...');
            await driver.findElement(By.id('amount')).sendKeys('780');

            console.log('Llenando el campo "Descripción"...');
            await driver.findElement(By.id('description')).sendKeys('Probando el test');

            console.log('Seleccionando una fecha...');
            await driver.findElement(By.id('date')).sendKeys('2024-08-08');

            console.log('Esperando a que se carguen las opciones del campo de personas...');
            const peopleSelect = await driver.findElement(By.id('people'));
            await driver.wait(until.elementLocated(By.xpath("//option[text()='Matias ']")), 10000);

            console.log('Seleccionando la opción "Matias" en el campo de personas...');
            await peopleSelect.findElement(By.xpath("//option[text()='Matias ']")).click();

            console.log('Guardando el pago...');
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
