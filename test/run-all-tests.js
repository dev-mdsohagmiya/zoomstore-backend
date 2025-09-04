import { spawn } from "child_process";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const runTest = (testFile) => {
  return new Promise((resolve, reject) => {
    console.log(`\n🧪 Running ${testFile}...`);
    console.log("=".repeat(50));

    const child = spawn("node", [testFile], {
      cwd: __dirname,
      stdio: "inherit",
    });

    child.on("close", (code) => {
      if (code === 0) {
        console.log(`✅ ${testFile} completed successfully`);
        resolve();
      } else {
        console.log(`❌ ${testFile} failed with code ${code}`);
        reject(new Error(`Test ${testFile} failed`));
      }
    });

    child.on("error", (error) => {
      console.log(`❌ Error running ${testFile}:`, error.message);
      reject(error);
    });
  });
};

const runAllTests = async () => {
  console.log("🚀 Running All Tests");
  console.log("=".repeat(50));

  const tests = [
    "test-validation-direct.js",
    "test-login.js",
    "test-super-admin-validation.js",
  ];

  let passed = 0;
  let failed = 0;

  for (const test of tests) {
    try {
      await runTest(test);
      passed++;
    } catch (error) {
      failed++;
      console.log(`\n⚠️  Continuing with next test...`);
    }
  }

  console.log("\n" + "=".repeat(50));
  console.log("📊 Test Results Summary:");
  console.log(`✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`📈 Total: ${passed + failed}`);

  if (failed === 0) {
    console.log("\n🎉 All tests passed!");
  } else {
    console.log(
      `\n⚠️  ${failed} test(s) failed. Check the output above for details.`
    );
  }
};

// Run all tests
runAllTests().catch(console.error);
