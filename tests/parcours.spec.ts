import { test, expect } from "@playwright/test"
import { setStartDate, getFirstName } from "./helpers/admin"

// workers=1 (playwright.config.ts) garantit déjà l'exécution séquentielle.
// Pas de mode "serial" : un test rouge attendu (bug #2/#3) ne doit pas faire
// sauter les tests suivants.

test.afterAll(async () => {
  // Remet le compte de test dans un état propre : Jour 0 (programme pas commencé).
  await setStartDate(1)
})

test("Jour 0 : écran de bienvenue avec prénom et 5 onglets", async ({ page }) => {
  await setStartDate(1)
  const raw = await getFirstName()
  // /bienvenue affiche le prénom en casse "Titre" (1ère lettre maj, reste min).
  const prenom = raw.charAt(0).toUpperCase() + raw.slice(1).toLowerCase()

  await page.goto("/bienvenue")
  await expect(page.getByText(`Bienvenue ${prenom}`)).toBeVisible()

  for (const label of ["Jour", "Courses", "Recettes", "Méthode", "Coach"]) {
    await expect(page.getByRole("link", { name: label, exact: true })).toBeVisible()
  }
})

test("Bouton Jour 1 : depuis /bienvenue avec start_date=aujourd'hui, on arrive sur Jour 1 (pas Jour 0)", async ({ page }) => {
  await setStartDate(0)
  await page.goto("/bienvenue")

  await page.getByRole("link", { name: "Jour", exact: true }).click()
  await expect(page).toHaveURL(/\/jour/)
  await expect(page.getByText(/JOUR\s*1\b/)).toBeVisible()
  await expect(page.getByText(/JOUR\s*0\b/)).not.toBeVisible()
})

test("Jour 1 direct : start_date=aujourd'hui affiche l'écran Jour 1", async ({ page }) => {
  await setStartDate(0)
  await page.goto("/jour")
  await expect(page.getByText(/JOUR\s*1\b/)).toBeVisible()
})

test("Personnalisation Jour 1 : le prénom doit être visible [bug #2]", async ({ page }) => {
  await setStartDate(0)
  const prenom = await getFirstName()

  await page.goto("/jour")
  await expect(page.getByText(/JOUR\s*1\b/)).toBeVisible()
  await expect(page.getByText(prenom, { exact: false })).toBeVisible()
})

test("Jour 10 : start_date=J-9 affiche l'écran Jour 10", async ({ page }) => {
  await setStartDate(-9)
  await page.goto("/jour")
  await expect(page.getByText(/JOUR\s*10\b/)).toBeVisible()
})

test("Guard : start_date NULL redirige vers /bienvenue", async ({ page }) => {
  await setStartDate(null)
  await page.goto("/jour")
  await expect(page).toHaveURL(/\/bienvenue/)
})

// Doit être le DERNIER test : se déconnecter révoque globalement la session
// (Supabase signOut() côté app), ce qui invaliderait le storageState partagé
// pour tout test qui s'exécuterait après.
test("Déconnexion : un bouton de déconnexion existe et ramène à l'écran de connexion [bug #3]", async ({ page }) => {
  await setStartDate(0)
  await page.goto("/jour")

  await page.getByRole("link", { name: "Mon profil" }).click()
  await expect(page).toHaveURL(/\/profil/)

  await page.getByRole("button", { name: "Me déconnecter" }).click()
  await expect(page).toHaveURL(/\/login/)
})
