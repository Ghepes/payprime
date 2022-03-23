const path = require('path');
const { promises: fs, constants: { F_OK } } = require('fs');
const { expect } = require('chai');

const { pathUpdates, updateImportPaths, getUpgradeablePath } = require('../scripts/migrate-imports.js');

describe('migrate-imports.js', function () {
  it('every new path exists', async function () {
    for (const p of Object.values(pathUpdates)) {
      try {
        await fs.access(path.join('contracts', p), F_OK);
      } catch (e) {
        await fs.access(path.join('contracts', getUpgradeablePath(p)), F_OK);
      }
    }
  });

  it('replaces import paths in a file', async function () {
    const source = `
import '@payprime/contracts/math/Math.sol';
import '@payprime/contracts-upgradeable/math/MathUpgradeable.sol';
    `;
    const expected = `
import '@payprime/contracts/utils/math/Math.sol';
import '@payprime/contracts-upgradeable/utils/math/MathUpgradeable.sol';
    `;
    expect(updateImportPaths(source)).to.equal(expected);
  });
});
