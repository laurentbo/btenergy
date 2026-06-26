import { test as setup, expect, type Locator } from "@playwright/test"
import { ensureTestUser, setStartDate } from "./helpers/admin"

const AUTH_FILE = "tests/.auth/test-user.json"

// La page /login est encore en train d'hydrater juste après le chargement :
// React réconcilie le DOM avec son état initial ("") et efface ce qu'on vient
// de taper. On fill en boucle jusqu'à ce que la valeur tienne.
async function fillStable(locator: Locator, value: string) {
  await expect(async () => {
    await locator.fill(value)
    await expect(locator).toHaveValue(value, { timeout: 300 })
  }).toPass({ timeout: 10000 })
}

setup("authentifie le compte de test", async ({ page }) => {
  await ensureTestUser()
  // Évite que le guard /jour -> /bienvenue ne perturbe le login pendant le setup.
  await setStartDate(1)

  await page.goto("/login")
  await page.waitForTimeout(1500) // laisse l'hydratation React se terminer avant de remplir le form
  await fillStable(page.getByLabel("Ton email"), process.env.TEST_USER_EMAIL!)
  await fillStable(page.getByLabel("Ton mot de passe"), process.env.TEST_USER_PASSWORD!)
  await page.getByRole("button", { name: "Me connecter" }).click()

  await expect(page).toHaveURL(/\/(bienvenue|jour)/, { timeout: 15000 })
  await page.context().storageState({ path: AUTH_FILE })
})
