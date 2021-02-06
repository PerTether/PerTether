pragma solidity ^0.4.2;

contract BadPerformance {

    mapping(string=>uint) map0;
    mapping(string=>uint) map1;
    // Level 1 10 loops
    function badPerfLevel1(string arg0, uint arg1) public {
        for (uint p = 0; p < 10; p++) {
            map0[arg0] = arg1 + p;
            map1[arg0] = map0[arg0] + p;
        }
    }
    // Level 2 100 loops
    function badPerfLevel2(string arg0, uint arg1) public {
        for (uint p = 0; p < 100; p++) {
            map0[arg0] = arg1 + p;
            map1[arg0] = map0[arg0] + p;
        }
    }
    // Level 3 1000 loops
    function badPerfLevel3(string arg0, uint arg1) public {
        for (uint p = 0; p < 1000; p++) {
            map0[arg0] = arg1 + p;
            map1[arg0] = map0[arg0] + p;
        }
    }

}
