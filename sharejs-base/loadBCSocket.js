/**
 * Created by dsichau on 11.05.16.
 */

//This is required to load BCSocket into the global scope for sharejs
//http://stackoverflow.com/questions/31197220/can-i-use-an-es6-2015-module-import-to-set-a-reference-in-global-scope
import {BCSocket as bc} from 'browserchannel/dist/bcsocket-uncompressed'
window.BCSocket = bc;
