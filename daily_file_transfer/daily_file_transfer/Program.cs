using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.IO;

namespace daily_file_transfer
{
    class Program
    {
        static void Main(string[] args)
        {
            string[] defaultPathNames = new string[4] { "text1.txt", "text2.txt", "text3.txt", "text4.txt" };

            string path = Directory.GetCurrentDirectory().ToString();
            string newFolder = Path.Combine(@path, "newFolder");
            string oldFolder = Path.Combine(@path, "oldFolder");

            Directory.CreateDirectory(newFolder);
            Directory.CreateDirectory(oldFolder);

            DirectoryInfo di = new DirectoryInfo(oldFolder);

            FileInfo[] TXTFiles = di.GetFiles("*.txt");
            if (TXTFiles.Length == 0)
            {
                WriteNewFiles(oldFolder, defaultPathNames);
            }
            else
            {
                CheckModifiedTime(TXTFiles, oldFolder, newFolder);
            }
            
        }

        static void CheckModifiedTime(FileInfo[] TXTFiles, string oldFolder, string newFolder)
        {
            foreach (var fi in TXTFiles)
            {
                try
                {
                    string pathToCheck = Path.Combine(oldFolder, fi.ToString());
                    DateTime dt = File.GetLastWriteTime(pathToCheck);
                    DateTime oneDayPrior = dt.AddDays(-1);
                    int result = DateTime.Compare(oneDayPrior, dt);
                    if (result == -1)
                    {
                        string newPath = Path.Combine(newFolder, fi.ToString());
                        File.Copy(pathToCheck, newPath, true);
                        Console.WriteLine("Files written: " + newPath);
                    }
                    else
                    {
                        Console.WriteLine("Files not updated: " + pathToCheck);
                    }
                }
                catch (Exception ex)
                {
                    Console.WriteLine(ex.ToString());
                }

            }
        }

        private static void WriteNewFiles(string p, string[] fileCheck)
        {
            int i = 1;
            foreach (var fi in fileCheck)
            {
                WriteEachFile(p, fi, i);
                i = i + 1;
            }
        }

        private static void WriteEachFile(string p, string fi, int i)
        {
            string file = Path.Combine(p, fi);
            try
            {
                using (FileStream fs = File.Create(file))
                {
                    string str = "This is text file number " + i + ".";
                    Byte[] info = new UTF8Encoding(true).GetBytes(str);
                    fs.Write(info, 0, info.Length);
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.ToString());
            }
        }
    }
}
