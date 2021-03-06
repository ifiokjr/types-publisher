import { FS, getDefinitelyTyped } from "./get-definitely-typed";
import { Options } from "./lib/common";
import { CachedNpmInfoClient, UncachedNpmInfoClient } from "./lib/npm-client";
import { AllPackages } from "./lib/packages";
import { ChangedPackages, computeAndSaveChangedPackages } from "./lib/versions";
import { consoleLogger } from "./util/logging";
import { logUncaughtErrors } from "./util/util";

if (!module.parent) {
    logUncaughtErrors(async () => calculateVersions(await getDefinitelyTyped(Options.defaults), new UncachedNpmInfoClient()));
}

export default async function calculateVersions(dt: FS, uncachedClient: UncachedNpmInfoClient): Promise<ChangedPackages> {
    console.log("=== Calculating versions ===");
    return CachedNpmInfoClient.with(uncachedClient, async client =>
        computeAndSaveChangedPackages(await AllPackages.read(dt), consoleLogger.info, client));
}
