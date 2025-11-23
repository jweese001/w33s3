# Checklist: Deploying Your Website to GitHub Pages with a GoDaddy Custom Domain

This guide will walk you through the entire process of deploying your website to GitHub Pages and connecting it to a custom domain you've purchased from GoDaddy.

---

### **Part 1: Prepare Your Project and GitHub Repository**

This part covers getting your local project ready and pushing it to GitHub.

*   **[ ] 1. Clean Up Your Project (Optional but Recommended):**
    *   Remove any files or folders that are not needed for the live site (e.g., `node_modules`, temporary files, backups).

*   **[ ] 2. Create a `CNAME` File:**
    *   In the root directory of your project (the `site` folder), create a new file named exactly `CNAME` (all uppercase, no extension).
    *   Inside this file, add your custom domain name. If you want your site to be at `www.yourdomain.com`, you should put `www.yourdomain.com` in the file. If you want it at the root domain (`yourdomain.com`), put that in the file. It's generally recommended to use the `www` subdomain.
    *   **Example `CNAME` file content:**
        ```
        www.yourdomain.com
        ```

*   **[ ] 3. Initialize a Git Repository:**
    *   If you haven't already, open a terminal in your project's root directory (`/Users/kraken/Documents/site`) and run the following command:
        ```bash
        git init
        ```

*   **[ ] 4. Create a New Repository on GitHub:**
    *   Go to [GitHub](https://github.com) and create a new, empty repository.
    *   For a portfolio site, the best practice is to name the repository `<your-github-username>.github.io`. This will create a "user site" which is served from the root of the repository.

*   **[ ] 5. Add, Commit, and Push Your Code:**
    *   In your terminal, run the following commands to add your files, commit them, and push them to your new GitHub repository. Replace `<your-github-username>` and `<repository-name>` with your actual GitHub username and repository name.

        ```bash
        git add .
        git commit -m "Initial commit of portfolio site"
        git remote add origin https://github.com/<your-github-username>/<repository-name>.git
        git branch -M main
        git push -u origin main
        ```

---

### **Part 2: Configure GitHub Pages**

This part covers telling GitHub how to serve your site.

*   **[ ] 1. Go to Your Repository Settings:**
    *   Navigate to your new repository on GitHub.
    *   Click on the **"Settings"** tab.

*   **[ ] 2. Go to the "Pages" Section:**
    *   In the left-hand menu, click on **"Pages"**.

*   **[ ] 3. Configure the Source Branch:**
    *   Under "Build and deployment", for the "Source", select **"Deploy from a branch"**.
    *   For the branch, select `main` and `/ (root)`.
    *   Click **"Save"**.

*   **[ ] 4. Enter Your Custom Domain:**
    *   In the "Custom domain" section, enter your custom domain name (the same one you put in the `CNAME` file, e.g., `www.yourdomain.com`).
    *   Click **"Save"**. GitHub will start the process of verifying your domain.

---

### **Part 3: Configure Your GoDaddy DNS Settings**

This part covers telling GoDaddy where to point your domain.

*   **[ ] 1. Log in to GoDaddy:**
    *   Log in to your GoDaddy account and go to "My Products".
    *   Find your domain and click on **"DNS"**.

*   **[ ] 2. Add `A` Records for the Root Domain:**
    *   You need to create four `A` records that point your root domain (`@`) to GitHub's IP addresses. If you already have an `A` record for `@`, you will need to edit it and add the other three.
    *   **Add the following four `A` records:**
        *   **Type:** `A`
        *   **Name:** `@`
        *   **Value:** `185.199.108.153`
        *   **TTL:** 1 Hour

        *   **Type:** `A`
        *   **Name:** `@`
        *   **Value:** `185.199.109.153`
        *   **TTL:** 1 Hour

        *   **Type:** `A`
        *   **Name:** `@`
        *   **Value:** `185.199.110.153`
        *   **TTL:** 1 Hour

        *   **Type:** `A`
        *   **Name:** `@`
        *   **Value:** `185.199.111.153`
        *   **TTL:** 1 Hour

*   **[ ] 3. Add a `CNAME` Record for the `www` Subdomain:**
    *   You need to create a `CNAME` record that points your `www` subdomain to your GitHub Pages URL.
    *   **Add the following `CNAME` record:**
        *   **Type:** `CNAME`
        *   **Name:** `www`
        *   **Value:** `<your-github-username>.github.io` (replace with your GitHub username)
        *   **TTL:** 1 Hour

*   **[ ] 4. Wait for DNS Propagation:**
    *   DNS changes can take some time to propagate across the internet. This can be anywhere from a few minutes to 48 hours, but it's usually pretty fast.

---

### **Part 4: Verify and Finalize**

This part covers the final checks to make sure everything is working correctly.

*   **[ ] 1. Check for Verification on GitHub:**
    *   Go back to your GitHub repository's "Pages" settings.
    *   After a few minutes, the "Custom domain" section should show a green checkmark, indicating that your domain is verified.

*   **[ ] 2. Enforce HTTPS:**
    *   Once your domain is verified, you should see an option to **"Enforce HTTPS"**.
    *   Check this box to ensure that your site is served over a secure connection. GitHub will automatically provision an SSL certificate for you.

*   **[ ] 3. Test Your Site:**
    *   Open a new browser window and navigate to your custom domain (e.g., `https://www.yourdomain.com`).
    *   Your website should now be live!

---

**Congratulations! Your website is now deployed on GitHub Pages with a custom domain.**
