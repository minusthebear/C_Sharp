using System;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading;
using NUnit.Framework;
using OpenQA.Selenium;
using OpenQA.Selenium.Firefox;
using OpenQA.Selenium.Support.UI;

namespace SeleniumTests
{
    [TestFixture]
    public class YouTubeTests
    {
        private IWebDriver driver;
        private StringBuilder verificationErrors;
        private string baseURL;
        private bool acceptNextAlert = true;
        
        [SetUp]
        public void SetupTest()
        {
            driver = new FirefoxDriver();
            baseURL = "https://www.youtube.com/";
            verificationErrors = new StringBuilder();
        }
        
        [TearDown]
        public void TeardownTest()
        {
            try
            {
                driver.Quit();
            }
            catch (Exception)
            {
                // Ignore errors if unable to close the browser
            }
            Assert.AreEqual("", verificationErrors.ToString());
        }
        
        [Test]
        public void TheYouTubeTestsTest()
        {
            // open | / | 
            driver.Navigate().GoToUrl(baseURL + "/");
            // click | //div[@id='appbar-nav']/ul/li[2]/a/span | 
            driver.FindElement(By.XPath("//div[@id='appbar-nav']/ul/li[2]/a/span")).Click();
            // click | link=Film Theory: The Cars in The Cars Movie AREN'T CARS! | 
            driver.FindElement(By.LinkText("Film Theory: The Cars in The Cars Movie AREN'T CARS!")).Click();
            // click | css=button.ytp-play-button.ytp-button | 
            driver.FindElement(By.CssSelector("button.ytp-play-button.ytp-button")).Click();
            // click | xpath=(//button[@type='button'])[2] | 
            driver.FindElement(By.XPath("(//button[@type='button'])[2]")).Click();
            // type | id=Email | invalud
            driver.FindElement(By.Id("Email")).Clear();
            driver.FindElement(By.Id("Email")).SendKeys("invalud");
            // click | id=next | 
            driver.FindElement(By.Id("next")).Click();
            // type | id=Passwd | invalud
            driver.FindElement(By.Id("Passwd")).Clear();
            driver.FindElement(By.Id("Passwd")).SendKeys("invalud");
            // click | id=signIn | 
            driver.FindElement(By.Id("signIn")).Click();
            // assertElementPresent | id=errormsg_0_Passwd | 
            Assert.IsTrue(IsElementPresent(By.Id("errormsg_0_Passwd")));
        }
        private bool IsElementPresent(By by)
        {
            try
            {
                driver.FindElement(by);
                return true;
            }
            catch (NoSuchElementException)
            {
                return false;
            }
        }
        
        private bool IsAlertPresent()
        {
            try
            {
                driver.SwitchTo().Alert();
                return true;
            }
            catch (NoAlertPresentException)
            {
                return false;
            }
        }
        
        private string CloseAlertAndGetItsText() {
            try {
                IAlert alert = driver.SwitchTo().Alert();
                string alertText = alert.Text;
                if (acceptNextAlert) {
                    alert.Accept();
                } else {
                    alert.Dismiss();
                }
                return alertText;
            } finally {
                acceptNextAlert = true;
            }
        }
    }
}
