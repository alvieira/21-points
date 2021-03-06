import { browser, ExpectedConditions as ec } from 'protractor';
import { NavBarPage, SignInPage } from '../../page-objects/jhi-page-objects';

import { PointsComponentsPage, PointsDeleteDialog, PointsUpdatePage } from './points.page-object';

describe('Points e2e test', () => {
    let navBarPage: NavBarPage;
    let signInPage: SignInPage;
    let pointsUpdatePage: PointsUpdatePage;
    let pointsComponentsPage: PointsComponentsPage;
    let pointsDeleteDialog: PointsDeleteDialog;

    beforeAll(async () => {
        await browser.get('/');
        navBarPage = new NavBarPage();
        signInPage = await navBarPage.getSignInPage();
        await signInPage.autoSignInUsing('admin', 'admin');
        await browser.wait(ec.visibilityOf(navBarPage.entityMenu), 5000);
    });

    it('should load Points', async () => {
        await navBarPage.goToEntity('points');
        pointsComponentsPage = new PointsComponentsPage();
        expect(await pointsComponentsPage.getTitle()).toMatch(/twentyOnePointsApp.points.home.title/);
    });

    it('should load create Points page', async () => {
        await pointsComponentsPage.clickOnCreateButton();
        pointsUpdatePage = new PointsUpdatePage();
        expect(await pointsUpdatePage.getPageTitle()).toMatch(/twentyOnePointsApp.points.home.createLabel/);
        await pointsUpdatePage.cancel();
    });

    it('should create and save Points', async () => {
        await pointsComponentsPage.clickOnCreateButton();
        await pointsUpdatePage.setDateInput('2000-12-31');
        expect(await pointsUpdatePage.getDateInput()).toMatch('2000-12-31');
        expect(await pointsUpdatePage.getExerciseInput()).toBeTruthy();
        expect(await pointsUpdatePage.getMealsInput()).toBeTruthy();
        expect(await pointsUpdatePage.getAlcoholInput()).toBeTruthy();
        await pointsUpdatePage.setNotesInput('notes');
        expect(await pointsUpdatePage.getNotesInput()).toMatch('notes');
        await pointsUpdatePage.userSelectLastOption();
        await pointsUpdatePage.save();
        expect(await pointsUpdatePage.getSaveButton().isPresent()).toBeFalsy();
    });

    it('should delete last Points', async () => {
        const nbButtonsBeforeDelete = await pointsComponentsPage.countDeleteButtons();
        await pointsComponentsPage.clickOnLastDeleteButton();

        pointsDeleteDialog = new PointsDeleteDialog();
        expect(await pointsDeleteDialog.getDialogTitle()).toMatch(/twentyOnePointsApp.points.delete.question/);
        await pointsDeleteDialog.clickOnConfirmButton();

        expect(await pointsComponentsPage.countDeleteButtons()).toBe(nbButtonsBeforeDelete - 1);
    });

    afterAll(async () => {
        await navBarPage.autoSignOut();
    });
});
