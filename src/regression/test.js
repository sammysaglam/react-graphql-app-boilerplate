import selenium, { By } from 'selenium-webdriver';

const driver = new selenium.Builder()
	.withCapabilities(selenium.Capabilities.chrome())
	.build();

const TIMEOUT = 10000;

// eslint-disable-next-line jest/no-hooks
afterAll(() => {
	driver.quit();
});

describe('cool', () => {
	it(
		'does a test',
		async done => {
			await driver.get('http://www.techinsight.io/');

			const bodyId = await driver
				.findElement(By.tagName('body'))
				.getAttribute('id');

			expect(bodyId).toBe('home');

			done();
		},
		TIMEOUT,
	);

	it(
		'does another test',
		async done => {
			await driver.get('http://www.techinsight.io/review');

			const bodyId = await driver
				.findElement(By.tagName('body'))
				.getAttribute('id');

			expect(bodyId).toBe('tech-review');

			done();
		},
		TIMEOUT,
	);
});
