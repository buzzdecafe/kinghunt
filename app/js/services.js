'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
angular.module('kinghunt.services', []).
  value('version', '0.0.1').
  value('credits', [
    {name: 'chess.js', url: 'https://github.com/jhlywa/chess.js'},
    {name: 'chessboardjs', url: 'https://github.com/oakmac/chessboardjs'},
    {name: 'Yet Another Chess Problem Database', url: 'http://www.yacpdb.org/'}
  ]).
  factory('gameSvc', function() {
    var gameObj = (function() {
      var game;

      return {
        getGame: function() {
          if  (!game) {
            game = new Chess();
          }
          return game;
        },

        getMovesRemaining: function(goalMoves) {
          // TODO: at present, only for "w to play & mate" scenarios; expand for more scenarios
          var fenObj = gameObj.fenToObject(game.fen());
          var remaining = goalMoves - fenObj.fullmove;
          return (fenObj.turn === 'w') ? remaining + 1 : remaining;
        },

        getStatus: function(goalMoves) {
          var moveColor = game.turn();
          var isMate = game.in_checkmate();
          var remaining = gameObj.getMovesRemaining(goalMoves);
          var status = {
            turn: moveColor,
            situation: "",
            progress: ""
          };

          if (isMate) {
            status.situation = ' checkmated';
          } else if (game.in_draw()) {
            status.situation = ' Drawn';
            status.progress = 'FAILED';
          } else if (game.in_check() === true) {
            status.situation = ' is in check';
          } else {
            status.situation = ' to move';
          }

          if (isMate && remaining >= 0) {
            status.progress = "SOLVED";
          } else if (remaining < 1) {
            status.progress = "FAILED";
          } else {
            status.progress = "(" + remaining +  " to go)";
          }
          return status;
        },

        getBoardConfig: function(scope) {
          return {
            position: scope.problem.fen,
            draggable: true,
            onDragStart: function(source, piece, position, orientation) {
              var turn = game.turn();
              if (game.game_over() === true ||
                  (turn === 'w' && piece.search(/^b/) === 0) ||
                  (turn === 'b' && piece.search(/^w/) === 0)) {
                return false;
              }
            },
            onDrop: function(source, target) {
              // see if the move is legal
              var move = game.move({
                from: source,
                to: target,
                promotion: 'q' // TODO: handle all promotions
              });

              // illegal move
              if (move === null) {
                return 'snapback';
              }

              scope.status = gameObj.getStatus(scope.goalMoves);
              scope.$apply();
  //            if (scope.mode === 'auto') {
  //              opponentMove();
  //            }
            },
            onSnapbackEnd: function() {
              scope.board.position(game.fen());
            }
          };
        },

        fenToObject: function(fen) {
          var parts = fen.split(/\s+/);
          return {
            position: parts[0],
            turn: parts[1] || 'w',
            castle: parts[2] || '-',
            enpassant: parts[3] || '-',
            halfmove: parts[4] || 0,
            fullmove: parts[5] || 1
          };
        }
      };
    }());

    return gameObj;
  }).
  factory("bookSvc", function() {

      // TODO: initialize book

      // TODO: initialize solved

      return {

        getFenById: function(id) {
          var problems = this.book.problems;
          var i, flen;
          for (i = 0, flen = problems.length; i < flen; i++) {
            if (problems[i].id === id) {
              return problems[i];
            }
          }
        },

        getNext: function(id) {
          var problems = this.book.problems;
          var i, flen;
          for (i = 0, flen = problems.length; i < flen; i++) {
            if (problems[i].id === id) {
              return (problems[i + 1]) ? problems[i + 1] : null;
            }
          }
        },

        getPrev: function(id) {
          var problems = this.book.problems;
          var i, flen;
          for (i = 0, flen = problems.length; i < flen; i++) {
            if (problems[i].id === id) {
              return (problems[i - 1]) ? problems[i - 1] : null;
            }
          }
        },

        solved: {
          "2118": true,
          "2119": true,
          "2125": true
        },

        markSolved: function(id) {
          this.solved[id] = true;
        },

        markUnsolved: function(id) {
          delete this.solved[id];
        },

        setBook: function(newBook) {
          this.book = newBook;
        },

        book: {
          title: "English Chess Problems",
          year: "1876",
          problems: [
            {"id":"2118", "author": "Bennett, Frederick W.", "stipulation":"#2", "fen":"3N4/7r/N2p4/1p1k1p2/4qP2/1KB3P1/Q5B1/2b5  w - - 0 1"},
            {"id":"2119", "author": "Bennett, Frederick W.", "stipulation":"#2", "fen":"1B6/2NQ4/P5p1/KR2PpP1/2b1qk2/5PRP/1p1P1N1P/1B6  w - - 0 1"},
            {"id":"2125", "author": "Bennett, Frederick W.", "stipulation":"#2", "fen":"8/KBp1p3/P1PkP3/2NN1Qp1/1B1q1prb/2P2Pp1/3R2P1/8  w - - 0 1"},
            {"id":"7326", "author": "Fawcett, Douglas", "stipulation":"#2", "fen":"Q5bn/4r3/2pR1R2/1pK1k3/4p1BN/2p1P1n1/3N4/8  w - - 0 1"},
            {"id":"10165", "author": "Healey, Frank", "stipulation":"#2", "fen":"1b6/8/4KB2/8/6N1/Q3RPk1/6p1/6N1  w - - 0 1"},
            {"id":"15213", "author": "Lord, Frederick William", "stipulation":"#2", "fen":"b2b4/Rn1B2B1/RnPk1p2/p1N5/P3P3/5N2/1Q6/7K  w - - 0 1"},
            {"id":"17204", "author": "Mitcheson, William", "stipulation":"#2", "fen":"5N2/3B1p2/2Np1n2/1K1k3r/3pn2b/4pQ2/2P5/8  w - - 0 1"},
            {"id":"33009", "author": "Bennett, Frederick W.", "stipulation":"#2", "fen":"3K1R1n/2P2bB1/3P1Np1/1n2k1p1/3q1NP1/3R1B2/Q6P/8  w - - 0 1"},
            {"id":"33011", "author": "Cruickshank, R. J.", "stipulation":"#2", "fen":"4N3/3Q4/q3P3/p4r2/3Pk3/2n1N1P1/B2RPP2/K7  w - - 0 1"},
            {"id":"33012", "author": "Finlinson, Joseph Henry Scott", "stipulation":"#2", "fen":"Q1n5/1rR5/1p1NK1p1/r1b2PP1/2BkbR2/BPp1p2p/6qP/4N1n1  w - - 0 1"},
            {"id":"33013", "author": "Frankenstein, Edward Nathan", "stipulation":"#2", "fen":"Q7/1N1q4/4RB2/3kr1P1/2n5/4R1N1/B7/6K1  w - - 0 1"},
            {"id":"33017", "author": "Hopwood, Thomas Henry", "stipulation":"#2", "fen":"q1R4B/8/2b3Q1/3kN2p/BP6/2n1p3/2R5/2n4K  w - - 0 1"},
            {"id":"33019", "author": "Johnson, Richard Wright", "stipulation":"#2", "fen":"8/3bKN2/2B3P1/2P3R1/2P2k2/4p3/3n4/2QRqnB1  w - - 0 1"},
            {"id":"33020", "author": "Kempe, A.", "stipulation":"#2", "fen":"8/3p2b1/2pB1P2/n7/p2kPP2/R1n2K2/QNP5/8  w - - 0 1"},
            {"id":"33021", "author": "Kidson, Henry Edwin", "stipulation":"#2", "fen":"B3RK1b/5N2/3pNp1P/1pqn1k1P/1P4p1/2Rp2B1/Q3P3/8  w - - 0 1"},
            {"id":"33022", "author": "Slater, George James", "stipulation":"#2", "fen":"1BNbb3/7Q/5PP1/1n1P1krR/3R1pN1/4p2P/1Kn2r2/1B6  w - - 0 1"},
            {"id":"33024", "author": "Spens, Walter Cook", "stipulation":"#2", "fen":"1B1RQ3/1p6/2b5/1p1q4/1N1k3r/2r1n3/1n1NK2p/2R5  w - - 0 1"},
            {"id":"33025", "author": "Taylor, Jesse Paul", "stipulation":"#2", "fen":"3Rr3/4P3/1Pk1P3/Pp6/4N3/b3KB2/2ppP3/2q4n  w - - 0 1"},
            {"id":"33027", "author": "Townsend, A.", "stipulation":"#2", "fen":"8/8/2N2p2/2P1p3/Qp2k3/1K2B2P/2N2P2/1B6  w - - 0 1"},
            {"id":"33028", "author": "Tyrell, S.", "stipulation":"#2", "fen":"3R4/6Q1/pr1b1p2/Nn2kbR1/pPB5/P4P1N/4p1K1/4B3  w - - 0 1"},
            {"id":"33029", "author": "Wormald, Robert Bownas", "stipulation":"#2", "fen":"5RK1/pk6/bP2R3/5p2/2N5/1n1p3p/Q5N1/5q1B  w - - 0 1"},
            {"id":"33030", "author": "Kidson, Henry Edwin", "stipulation":"#2", "fen":"4r3/p1P1p2n/6RK/rkN2R2/1p6/1P1p4/5BB1/8  w - - 0 1"},
            {"id":"33031", "author": "Taylor, Jesse Paul", "stipulation":"#2", "fen":"3NR1B1/1p2P3/3b4/4k1K1/QRb1P1p1/2pPn3/5B1N/8  w - - 0 1"},
            {"id":"47507", "author": "Abbott, Joseph William", "stipulation":"#3", "fen":"5B2/8/6p1/3P4/1Npk1p2/n3N2B/5Q2/5K2  w - - 0 1"},
            {"id":"47508", "author": "Abbott, Joseph William", "stipulation":"#3", "fen":"2KR4/3p1N2/3pB3/2p1p1R1/3kP3/3p2P1/P2B4/8  w - - 0 1"},
            {"id":"47511", "author": "Abbott, Joseph William", "stipulation":"#3", "fen":"4K3/8/3k4/2RbN3/1p1P4/nR3p1B/8/Q7  w - - 0 1"},
            {"id":"47512", "author": "Abbott, Joseph William", "stipulation":"#3", "fen":"3Q4/8/2pNp2P/1p6/3k1N2/6P1/3P4/K3B2n  w - - 0 1"},
            {"id":"47513", "author": "Abbott, Joseph William", "stipulation":"#3", "fen":"8/1r6/pp3N2/8/B1kB4/2P1p3/3pP1n1/3K1Q1b  w - - 0 1"},
            {"id":"47514", "author": "Abbott, Joseph William", "stipulation":"#3", "fen":"2Rb4/1Q1nk3/n1pNb2p/2p4N/2P1R1pK/4P1B1/8/8  w - - 0 1"},
            {"id":"47515", "author": "Abbott, Joseph William", "stipulation":"#3", "fen":"3K4/8/3Npp2/3kB2Q/8/3Pp1P1/8/8  w - - 0 1"},
            {"id":"47516", "author": "Abbott, Joseph William", "stipulation":"#3", "fen":"6K1/8/N4RP1/4R2Q/3p4/3k1B2/1np5/2B5  w - - 0 1"},
            {"id":"49298", "author": "Healey, Frank", "stipulation":"#3", "fen":"8/8/1Q6/2p1b3/2Nk4/P2B4/2P5/7K  w - - 0 1"},
            {"id":"49302", "author": "Duffy, Patrick Thomas", "stipulation":"#3", "fen":"8/3N2n1/p7/Q7/4k1n1/2K1p2N/4B1rP/8  w - - 0 1"},
            {"id":"49304", "author": "Pierce, William Timbrell", "stipulation":"#3", "fen":"2k1N3/2B3p1/1P4p1/4R1K1/8/8/8/7B  w - - 0 1"},
            {"id":"49306", "author": "Wormald, Robert Bownas", "stipulation":"#3", "fen":"nN2Q3/4p1n1/pp1b2K1/r3k3/b3pN2/4P3/8/8  w - - 0 1"},
            {"id":"50251", "author": "Smith, Thomas", "stipulation":"#3", "fen":"8/p5r1/Qb5n/1n1Bp1RP/5k1K/4Np2/2P5/4R3  w - - 0 1"},
            {"id":"50252", "author": "Smith, Thomas", "stipulation":"#3", "fen":"7b/3p2B1/1K2R3/3k4/8/3b2P1/8/1N2nQ2  w - - 0 1"},
            {"id":"50253", "author": "Smith, Thomas", "stipulation":"#3", "fen":"1K6/5p2/4b3/2pRN3/1pN4p/1Pk3B1/P5n1/1Bn5  w - - 0 1"},
            {"id":"50254", "author": "Smith, Thomas", "stipulation":"#3", "fen":"3B4/1p6/1K6/4kp2/2p2N2/8/3Q4/1b1N4  w - - 0 1"},
            {"id":"50255", "author": "Smith, Thomas", "stipulation":"#3", "fen":"2K5/4pN1B/4k2r/p7/8/2N1pQ2/4R3/bb3n2  w - - 0 1"},
            {"id":"50256", "author": "Brown, John", "stipulation":"#3", "fen":"8/4p1p1/4Kp2/8/2p1kN2/3bN1Q1/1b6/8  w - - 0 1"},
            {"id":"50257", "author": "Brown, John", "stipulation":"#3", "fen":"8/8/2N5/1Q3N2/3Pkb1r/6p1/6P1/Kb6  w - - 0 1"},
            {"id":"50259", "author": "Brown, John", "stipulation":"#3", "fen":"4n3/b3r3/2N2p2/1N1n4/2B3R1/4k3/4p1P1/4K3  w - - 0 1"},
            {"id":"50260", "author": "Angas, Silas", "stipulation":"#3", "fen":"3q2N1/3bp3/7R/5k2/3Qp2K/4P3/8/8  w - - 0 1"},
            {"id":"50261", "author": "Angas, Silas", "stipulation":"#3", "fen":"8/4pR1K/4N1p1/7k/2q4p/8/8/7Q  w - - 0 1"},
            {"id":"50262", "author": "Duffy, Patrick Thomas", "stipulation":"#3", "fen":"8/6p1/nBp1p3/4k1K1/8/N1Np2p1/1n4B1/8  w - - 0 1"},
            {"id":"50263", "author": "Wormald, Robert Bownas", "stipulation":"#3", "fen":"nB2Q3/1p1Rpp2/2p1k3/1p4P1/1P2r3/1P2P3/6N1/R4K1B  w - - 0 1"},
            {"id":"50264", "author": "Watts, John J.", "stipulation":"#3", "fen":"8/Nb6/4p2Q/b1P1pk2/1P1np2p/7P/1KnPPN2/2B5  w - - 0 1"},
            {"id":"50265", "author": "Townsend, A.", "stipulation":"#3", "fen":"Q7/1N2p3/2r1Pp2/2pN4/1pP5/1n2B3/p1KP4/k7  w - - 0 1"},
            {"id":"50266", "author": "Samuel H. Thomas,", "stipulation":"#3", "fen":"nb3Q2/4K2p/3PN3/P1p1p2r/R1N1k1P1/B1p3p1/B3P1qR/1b5n  w - - 0 1"},
            {"id":"50267", "author": "Slater, George James", "stipulation":"#3", "fen":"K3Q1N1/3Bn2r/1BPp1p2/3pk1b1/3R4/1PR2P2/2PPn1P1/8  w - - 0 1"},
            {"id":"50268", "author": "Pierce, William Timbrell", "stipulation":"#3", "fen":"4Q3/8/pP6/P2N1k1N/5B1P/2p1P3/2p5/2K5  w - - 0 1"},
            {"id":"50269", "author": "Pearson, Arthur Cyril", "stipulation":"#3", "fen":"1K6/5B1p/4N2k/4p3/4Pq2/6p1/4R3/2B5  w - - 0 1"},
            {"id":"50270", "author": "Pavitt, W. S.", "stipulation":"#3", "fen":"K7/2p4p/7Q/1p1pp3/1P2k1p1/4N3/Pb2PR2/7b  w - - 0 1"},
            {"id":"50271", "author": "Parr, G.", "stipulation":"#3", "fen":"4K3/1p1p1B2/3k1b1p/p2P4/2R2Pn1/3N2p1/8/5Q2  w - - 0 1"},
            {"id":"50272", "author": "Menzies, Hugh James", "stipulation":"#3", "fen":"8/3N4/4R3/1QP2k1K/1P3p2/4qr1p/4N3/6b1  w - - 0 1"},
            {"id":"50273", "author": "Johnson, Richard Wright", "stipulation":"#3", "fen":"B3K3/8/1p1k4/5R1p/3N1n2/1Nb5/5Qn1/2rb4  w - - 0 1"},
            {"id":"50274", "author": "Heywood, George Cann.", "stipulation":"#3", "fen":"N7/pp6/n2r4/1K1k4/4R2Q/1Pb1P3/8/2q5  w - - 0 1"},
            {"id":"50275", "author": "Greenwood, William W.", "stipulation":"#3", "fen":"qR2rkn1/4R2B/2N2n2/8/2bN1Q1b/5p2/p7/K7  w - - 0 1"},
            {"id":"50276", "author": "Greenwood, William W.", "stipulation":"#3", "fen":"5R2/2prn1b1/q1Nk2P1/1rRP4/4Q3/6N1/B1n4K/3b4  w - - 0 1"},
            {"id":"50277", "author": "Finlinson, Joseph Henry Scott", "stipulation":"#3", "fen":"3B1brr/1K2p2p/P3k1PN/3p4/3P3P/5p2/5P2/5Q2  w - - 0 1"},
            {"id":"50278", "author": "Deacon, Frederic H.", "stipulation":"#3", "fen":"8/p7/7Q/n1kp4/p6R/N7/2K3p1/7n  w - - 0 1"},
            {"id":"50279", "author": "Andrews, Henry John Clinton", "stipulation":"#3", "fen":"3nq3/6r1/1Rp1k1p1/1bB3P1/2N1K1N1/2b1Q3/B6r/8  w - - 0 1"},
            {"id":"50280", "author": "Wormald, Robert Bownas", "stipulation":"#3", "fen":"5n2/4B2p/4p2P/3pk3/2Pp2KN/5Ppp/3Nq3/3Q1b1r  w - - 0 1"},
            {"id":"50282", "author": "Wormald, Robert Bownas", "stipulation":"#3", "fen":"7K/4B3/2p5/N2pkB2/Q3P3/1r3R2/2r5/2N5  w - - 0 1"},
            {"id":"50283", "author": "Wormald, Robert Bownas", "stipulation":"#3", "fen":"6n1/4pb2/4R2p/4P2P/4Nkp1/3Qp1N1/4P3/K7  w - - 0 1"},
            {"id":"50285", "author": "Wormald, Robert Bownas", "stipulation":"#3", "fen":"R2B1r1q/1pr4n/1k3bQR/p1pPp3/2P1NP2/3B3p/P7/K6b  w - - 0 1"},
            {"id":"50286", "author": "Wormald, Robert Bownas", "stipulation":"#3", "fen":"4B1N1/7p/5pnP/5p1k/4pPRp/7p/4P2B/5K2  w - - 0 1"},
            {"id":"50287", "author": "White, Charles W.", "stipulation":"#3", "fen":"4Q3/4N3/2Bkp3/K5p1/p2pp3/6P1/8/3b2b1  w - - 0 1"},
            {"id":"50288", "author": "White, Charles W.", "stipulation":"#3", "fen":"5KQ1/8/n4N2/1p6/kP6/p1B5/8/8  w - - 0 1"},
            {"id":"50289", "author": "White, Charles W.", "stipulation":"#3", "fen":"1Q6/4K3/8/5Bk1/3ppp2/nR6/8/2b5  w - - 0 1"},
            {"id":"50290", "author": "White, Charles W.", "stipulation":"#3", "fen":"8/8/8/1p6/Np2p3/kp2NQ2/2p3K1/8  w - - 0 1"},
            {"id":"50291", "author": "White, Charles W.", "stipulation":"#3", "fen":"4n3/8/5b2/4p1Q1/K2Np3/3kB3/4R3/8  w - - 0 1"},
            {"id":"50292", "author": "White, Charles W.", "stipulation":"#3", "fen":"8/3b4/1pp1p3/2k5/1pPN4/3K4/1BQ5/8  w - - 0 1"},
            {"id":"50293", "author": "White, Charles W.", "stipulation":"#3", "fen":"3b2K1/3pp3/q1p5/1b5k/3N2p1/8/3Q3P/4B3  w - - 0 1"},
            {"id":"50294", "author": "White, Charles W.", "stipulation":"#3", "fen":"3N2n1/p5rp/1N2p2n/1P2p1Q1/4k3/6P1/4K3/6B1  w - - 0 1"},
            {"id":"50295", "author": "Wayte, William", "stipulation":"#3", "fen":"8/3R4/5p1K/3b1k2/8/4P2p/1BR2N2/7q  w - - 0 1"},
            {"id":"50296", "author": "Watts, J. H.", "stipulation":"#3", "fen":"3q4/1Q4B1/8/p7/P3R2N/1b1k4/4pP1r/2n1K2n  w - - 0 1"},
            {"id":"50298", "author": "Watts, J. H.", "stipulation":"#3", "fen":"4Q2n/1r2P2r/2B5/2Bn1p2/b3k1p1/1p1N4/4P3/1Kb5  w - - 0 1"},
            {"id":"50299", "author": "Tyrell, S.", "stipulation":"#3", "fen":"8/7p/6bR/1Pk3N1/1N2RBP1/8/K1P5/5B2  w - - 0 1"},
            {"id":"50301", "author": "Turton, Henry", "stipulation":"#3", "fen":"4K2k/1R2N1p1/6B1/4b3/p4p2/p2n4/7r/1Q6  w - - 0 1"},
            {"id":"50302", "author": "Turton, Henry", "stipulation":"#3", "fen":"8/p7/8/4kN2/8/1K1Q1P2/5P2/2B5  w - - 0 1"},
            {"id":"50304", "author": "Turton, Henry", "stipulation":"#3", "fen":"1b1n3q/2N2n2/p6r/p2p3b/3k4/B4p2/3K4/1Q3B2  w - - 0 1"},
            {"id":"50305", "author": "Turton, Henry", "stipulation":"#3", "fen":"8/3n2K1/1p4Q1/4k3/R3Np2/1P2b1B1/8/1b5B  w - - 0 1"},
            {"id":"50308", "author": "Samuel H. THOMAS", "stipulation":"#3", "fen":"3Nb3/p5qr/B4R2/k1pN4/n7/1P3pPQ/5P1p/R3b2K  w - - 0 1"},
            {"id":"50309", "author": "Samuel H. THOMAS", "stipulation":"#3", "fen":"5Q2/Rn4br/2pp3p/4kb2/R1B1pN1B/p2ppP2/1N6/7K  w - - 0 1"},
            {"id":"50310", "author": "Samuel H. THOMAS", "stipulation":"#3", "fen":"5QBq/2N4n/3B1p1R/8/2p1k1pK/1p6/1p3p2/3bbN2  w - - 0 1"},
            {"id":"50311", "author": "Samuel H. THOMAS", "stipulation":"#3", "fen":"R1n5/3Nb3/3pK3/3P4/3pk1P1/4p2N/2b1P1p1/Q7  w - - 0 1"},
            {"id":"50312", "author": "Samuel H. THOMAS", "stipulation":"#3", "fen":"4Q3/n4ppN/3p3b/3k4/3N1q1R/1K1Pp3/7B/3R4  w - - 0 1"},
            {"id":"50313", "author": "Samuel H. THOMAS", "stipulation":"#3", "fen":"n4B2/2p5/1pP1K3/7B/pN1kp1P1/p6Q/P2pP3/2bR4  w - - 0 1"},
            {"id":"50314", "author": "Taylor, Jean-Paul", "stipulation":"#3", "fen":"8/5p2/QKb1kP2/2P2R2/8/P7/2P5/B1n2N2  w - - 0 1"},
            {"id":"50315", "author": "Spens, Walter Cook", "stipulation":"#3", "fen":"6b1/5nQp/1N1p3p/1B1pq2R/1P1kp3/6P1/K2P1N2/8  w - - 0 1"},
            {"id":"50316", "author": "Spens, Walter Cook", "stipulation":"#3", "fen":"1B1N1N2/2r1p1p1/n2kB3/P1q1R3/3p3P/3P4/3QbK2/8  w - - 0 1"},
            {"id":"50317", "author": "Spens, Walter Cook", "stipulation":"#3", "fen":"8/1Np5/4n3/N4R1p/4k2P/n5KB/3PP3/8  w - - 0 1"},
            {"id":"50318", "author": "Spens, Walter Cook", "stipulation":"#3", "fen":"4nrk1/1r3pp1/3p1qp1/3N2P1/5N2/pBp5/K1P1Q2R/8  w - - 0 1"},
            {"id":"50319", "author": "Spens, Walter Cook", "stipulation":"#3", "fen":"7Q/8/3p4/7p/4k2P/3Np3/1K2P3/8  w - - 0 1"},
            {"id":"50320", "author": "Spens, Walter Cook", "stipulation":"#3", "fen":"2n5/8/4Kp2/B2N4/1Ppkp3/2R4p/q6P/5Nn1  w - - 0 1"},
            {"id":"50321", "author": "Spens, Walter Cook", "stipulation":"#3", "fen":"6B1/p1n5/ppp1q1R1/2Pkp3/8/3PK3/1N6/2R1B3  w - - 0 1"},
            {"id":"50322", "author": "Slater, George James", "stipulation":"#3", "fen":"8/B2p4/4k1B1/1N2b2P/P2pR2Q/Kn1n4/1R2N3/8  w - - 0 1"},
            {"id":"50323", "author": "Slater, George James", "stipulation":"#3", "fen":"4QB2/8/3p4/3kp3/8/4p3/p3B3/K7  w - - 0 1"},
            {"id":"50324", "author": "Slater, George James", "stipulation":"#3", "fen":"1rn5/B1p2R2/1p3P2/p1p5/3kp1R1/2pN4/B4Nbn/K1Q5  w - - 0 1"},
            {"id":"50325", "author": "Slater, George James", "stipulation":"#3", "fen":"2n5/2Q3B1/2pn1p2/2PP1P2/4kPp1/2PN2R1/4B3/4K3  w - - 0 1"},
            {"id":"50326", "author": "Slater, George James", "stipulation":"#3", "fen":"R7/5Pbp/R2Bk3/3p2PB/8/2N3pq/1N4bn/KQ6  w - - 0 1"},
            {"id":"50327", "author": "Ranken, Charles Edward", "stipulation":"#3", "fen":"6n1/8/4k1Kp/2P1PN1P/8/7Q/8/8  w - - 0 1"},
            {"id":"50328", "author": "Pierce, William Timbrell", "stipulation":"#3", "fen":"1R1K1n2/r2P4/R1pk4/p1N1p3/3N1PQn/8/B2Br3/7q  w - - 0 1"},
            {"id":"50329", "author": "Pierce, William Timbrell", "stipulation":"#3", "fen":"5Q2/6pr/2P1P3/1N2pP1P/P2bk1NR/Bp4P1/n3P3/5K2  w - - 0 1"},
            {"id":"50330", "author": "Pierce, William Timbrell", "stipulation":"#3", "fen":"3R4/8/8/1P1b4/3k4/8/1K1B4/3Q4  w - - 0 1"},
            {"id":"50332", "author": "Pierce, James", "stipulation":"#3", "fen":"2N5/3N1R2/8/pP1kB3/P1p5/2p5/2K5/8  w - - 0 1"},
            {"id":"50333", "author": "Pierce, James", "stipulation":"#3", "fen":"1b1R4/1Q6/3qp2n/2p3p1/PP1k4/1P1Br2P/1N2R3/B2K1n2  w - - 0 1"},
            {"id":"50334", "author": "Pierce, James", "stipulation":"#3", "fen":"2R5/8/3p2p1/1p1p4/R1rkpBp1/2n2bP1/pN3P2/KnNq2Q1  w - - 0 1"},
            {"id":"50335", "author": "Pearson, Arthur Cyril", "stipulation":"#3", "fen":"k7/np1N1K2/2pp4/1n6/1NQ5/8/1b6/R7  w - - 0 1"},
            {"id":"50337", "author": "Pearson, Arthur Cyril", "stipulation":"#3", "fen":"6r1/3QN3/Pp2p3/8/2k2r2/KN5b/5n2/4B3  w - - 0 1"},
            {"id":"50338", "author": "Pearson, Arthur Cyril", "stipulation":"#3", "fen":"r1r5/3R3b/p6P/4p3/5p2/K1k2Nn1/RNp1p2Q/8  w - - 0 1"},
            {"id":"50339", "author": "Pearson, Arthur Cyril", "stipulation":"#3", "fen":"8/2p3pp/2P1p1n1/3rk2N/1Q2Pp2/5P2/BK5B/4N3  w - - 0 1"},
            {"id":"50340", "author": "Pearson, Arthur Cyril", "stipulation":"#3", "fen":"8/1p1K1pQ1/4Pr2/P2k3p/1R1b4/3P4/3B4/8  w - - 0 1"},
            {"id":"50342", "author": "Pearson, Arthur Cyril", "stipulation":"#3", "fen":"4R3/1p3n2/n7/p7/3k4/P2P4/3K4/4Q3  w - - 0 1"},
            {"id":"50344", "author": "Pearson, Arthur Cyril", "stipulation":"#3", "fen":"5k2/4rpRr/3N3p/7P/8/4Q3/8/5R1K  w - - 0 1"},
            {"id":"50345", "author": "Pearson, Arthur Cyril", "stipulation":"#3", "fen":"8/8/2pN4/2Pk3K/8/1P4Q1/8/8  w - - 0 1"},
            {"id":"50346", "author": "Pavitt, W. S.", "stipulation":"#3", "fen":"r6n/7Q/4Bp2/nqp5/2p1N1p1/pk5b/N1R5/6K1  w - - 0 1"},
            {"id":"50347", "author": "Pavitt, W. S.", "stipulation":"#3", "fen":"6n1/2p3pb/2N2p1b/B2P2p1/3Kp1k1/4p1Pp/7P/5QR1  w - - 0 1"},
            {"id":"50348", "author": "Pavitt, W. S.", "stipulation":"#3", "fen":"2nK4/5N2/2p2p2/2p2p2/2kp1B2/5P2/P2Q2R1/1R1N4  w - - 0 1"},
            {"id":"50349", "author": "Pavitt, W. S.", "stipulation":"#3", "fen":"7B/5pb1/3K1kp1/2p2Bp1/1n6/2p3N1/7n/3Q4  w - - 0 1"},
            {"id":"50350", "author": "Pavitt, W. S.", "stipulation":"#3", "fen":"8/1p6/1N1pp3/kp2P3/PN1Q4/b2K4/8/1R4B1  w - - 0 1"},
            {"id":"50351", "author": "G. PARR", "stipulation":"#3", "fen":"K2b4/8/B1NnP2Q/7p/k4p1r/p3Np2/P7/3b1R2  w - - 0 1"},
            {"id":"50352", "author": "G. PARR", "stipulation":"#3", "fen":"7K/3b4/1n1P2RB/2P1kp2/1N5P/1Pp2P2/2N1P3/2n5  w - - 0 1"},
            {"id":"50353", "author": "R. OSMOND", "stipulation":"#3", "fen":"4R2n/8/2p5/3b1Np1/Ppk2bP1/1N2p3/KP2P3/4B3  w - - 0 1"},
            {"id":"50357", "author": "R. OSMOND", "stipulation":"#3", "fen":"5q1b/1pB2n2/8/1p3Q2/1R2p3/1PkN4/2P5/2K5  w - - 0 1"},
            {"id":"50358", "author": "Mitcheson, William", "stipulation":"#3", "fen":"8/3R4/4K3/1p2bN2/4kpn1/5b1Q/B7/4r3  w - - 0 1"},
            {"id":"50361", "author": "Miles, John Augustus", "stipulation":"#3", "fen":"8/K6R/1pR3Nr/3kn1p1/P2N4/3P2B1/8/7q  w - - 0 1"},
            {"id":"50362", "author": "Miles, John Augustus", "stipulation":"#3", "fen":"RK6/PpPkp2N/4bp2/3P1Pb1/1r1Q3r/n7/4B2q/8  w - - 0 1"},
            {"id":"50363", "author": "Miles, John Augustus", "stipulation":"#3", "fen":"N2nNn2/Pp2p2p/4k3/6pK/3R4/5P2/bBQ4b/1r3r2  w - - 0 1"},
            {"id":"50364", "author": "Menzies, Hugh James", "stipulation":"#3", "fen":"2K5/7P/5p1Q/1kp5/3p4/p7/P7/3BB3  w - - 0 1"},
            {"id":"50365", "author": "Menzies, Hugh James", "stipulation":"#3", "fen":"B3K1kr/5p1r/7p/6NN/4P3/8/8/B7  w - - 0 1"},
            {"id":"50369", "author": "Menzies, Hugh James", "stipulation":"#3", "fen":"8/8/2p2p2/2k5/4R3/8/3KB3/7Q  w - - 0 1"},
            {"id":"50370", "author": "Mcarthur, George", "stipulation":"#3", "fen":"1Q3K2/2R5/4Np2/3NB3/4k2P/3p4/3P4/8  w - - 0 1"},
            {"id":"50371", "author": "Mcarthur, George", "stipulation":"#3", "fen":"1Nn4N/3R2Kn/4pr2/1b1pkpp1/p3P3/B1P5/6PP/5Q2  w - - 0 1"},
            {"id":"50372", "author": "Mcarthur, George", "stipulation":"#3", "fen":"6Bk/3p2p1/3Pp3/2P1KpN1/3N2RP/2B5/4Q3/8  w - - 0 1"},
            {"id":"50373", "author": "Mcarthur, George", "stipulation":"#3", "fen":"8/pp1Bk2K/8/2p1p1P1/8/r2P1Q2/3B3p/7r  w - - 0 1"},
            {"id":"50374", "author": "Mcarthur, George", "stipulation":"#3", "fen":"8/6K1/3R4/2RNk3/6p1/2N3P1/3P1pr1/n5b1  w - - 0 1"},
            {"id":"50375", "author": "Lord, Frederick William", "stipulation":"#3", "fen":"5Q2/8/2K2Pp1/8/2N5/2P3b1/2P1k3/6R1  w - - 0 1"},
            {"id":"50376", "author": "Lord, Frederick William", "stipulation":"#3", "fen":"2K5/1pP2pN1/1Bk1nR2/p4p2/p4P2/P7/2P4p/2Q2Bbr  w - - 0 1"},
            {"id":"50378", "author": "Lord, Frederick William", "stipulation":"#3", "fen":"5Q2/8/4p3/4kp2/1P1ppRp1/6p1/2P3P1/K2R4  w - - 0 1"},
            {"id":"50379", "author": "Lord, Frederick William", "stipulation":"#3", "fen":"8/5nNb/3B2kp/3P1R1p/7P/2K1p1P1/4B3/8  w - - 0 1"},
            {"id":"50381", "author": "Kidson, Henry Edwin", "stipulation":"#3", "fen":"4rb2/1B5p/1p4p1/2R5/3kpN2/B3N1P1/4K3/n7  w - - 0 1"},
            {"id":"50382", "author": "Kidson, Henry Edwin", "stipulation":"#3", "fen":"1b2N3/p2B2nq/p1Rp2r1/P2k2p1/3P2P1/1P2B3/8/KQ6  w - - 0 1"},
            {"id":"50383", "author": "Kidson, Henry Edwin", "stipulation":"#3", "fen":"7q/6n1/4pbB1/2P2r2/1P1pkNp1/3Nn1P1/1KP1RR2/Q7  w - - 0 1"},
            {"id":"50384", "author": "Kidson, Henry Edwin", "stipulation":"#3", "fen":"3RQ3/5p2/1B6/2Npb2q/1Rnk4/8/b2P3p/n3N2K  w - - 0 1"},
            {"id":"50385", "author": "Kempe, A.", "stipulation":"#3", "fen":"2b3N1/rpr2R2/3p1Bp1/6p1/N4kP1/n1p2P1P/5K2/1B6  w - - 0 1"},
            {"id":"50386", "author": "Jordan, M. James", "stipulation":"#3", "fen":"4N3/2Pr4/4p3/3Nkp2/3p4/K2P4/3Q3P/8  w - - 0 1"},
            {"id":"50387", "author": "Jordan, M. James", "stipulation":"#3", "fen":"8/4B1pK/1P2R3/p2k4/B1RN4/3p1p2/4b3/5n2  w - - 0 1"},
            {"id":"50388", "author": "Jordan, M. James", "stipulation":"#3", "fen":"b7/8/2p1NNp1/4kn1R/2Q2p2/8/8/1K6  w - - 0 1"},
            {"id":"50389", "author": "Jordan, M. James", "stipulation":"#3", "fen":"8/2p5/2Q5/3pp3/1N4K1/4k3/8/1B6  w - - 0 1"},
            {"id":"50390", "author": "Johnson, Richard Wright", "stipulation":"#3", "fen":"b7/p3pK2/Q3N1p1/2p3P1/1N2kBP1/1p2p3/1n2B3/1n2b3  w - - 0 1"},
            {"id":"50392", "author": "Johnson, Richard Wright", "stipulation":"#3", "fen":"6qB/r2k1p1R/1P2N3/4K3/1Q1Nn1Bb/8/8/8  w - - 0 1"},
            {"id":"50393", "author": "Johnson, Richard Wright", "stipulation":"#3", "fen":"8/8/2p1N3/2P3p1/1PN2pP1/p2k1K2/B2B4/8  w - - 0 1"},
            {"id":"50395", "author": "Hunter, J. A. W.", "stipulation":"#3", "fen":"2N3B1/8/8/K6R/Rp1k1p2/3n1P2/3P4/8  w - - 0 1"},
            {"id":"50396", "author": "Hopwood, Thomas Henry", "stipulation":"#3", "fen":"3Q4/3p2K1/p6p/P3R3/3k1n1p/1PN3B1/8/2q1N3  w - - 0 1"},
            {"id":"50397", "author": "Hopwood, Thomas Henry", "stipulation":"#3", "fen":"1b1n4/Qpr2N2/N3p3/3p4/3p4/3k3B/2RB4/4K2n  w - - 0 1"},
            {"id":"50398", "author": "Hopwood, Thomas Henry", "stipulation":"#3", "fen":"Q7/5B2/2pK4/3Npk2/1n2Nb1p/5R2/2bP3P/8  w - - 0 1"},
            {"id":"50399", "author": "Healey, Frank", "stipulation":"#3", "fen":"2R5/3N1K2/1p6/1p1p2p1/pQnk2P1/P7/8/1Bb2N2  w - - 0 1"},
            {"id":"50400", "author": "Healey, Frank", "stipulation":"#3", "fen":"8/5Q2/5np1/5k2/8/3P4/6RB/4K3  w - - 0 1"},
            {"id":"50401", "author": "Healey, Frank", "stipulation":"#3", "fen":"8/8/Q7/2p1b3/2Nk4/P2B4/2P5/7K  w - - 0 1"},
            {"id":"50404", "author": "Andrews, Henry John Clinton", "stipulation":"#3", "fen":"4K3/1pp3b1/4k1N1/q1PR2p1/8/1B2P3/1B3r2/3r1N1b  w - - 0 1"},
            {"id":"50407", "author": "Baxter, Crichton M.", "stipulation":"#3", "fen":"4B1Q1/2pr2p1/5nR1/P3kP2/2bN3p/4K2P/2R5/4B3  w - - 0 1"},
            {"id":"50408", "author": "Baxter, Crichton M.", "stipulation":"#3", "fen":"1r6/1p1Q3p/R5n1/1p2p3/B1n1kBp1/1NP5/KP2Pq2/4R1r1  w - - 0 1"},
            {"id":"50418", "author": "Campbell, Joseph Graham", "stipulation":"#3", "fen":"3N4/5pp1/8/B1kpP1nQ/2pN1P2/3B4/8/1KR5  w - - 0 1"},
            {"id":"50421", "author": "Callander, Charles", "stipulation":"#3", "fen":"4n2b/1p6/1P1N2P1/3kpN1R/K1p5/3p4/3Q4/4R3  w - - 0 1"},
            {"id":"50422", "author": "Callander, Charles", "stipulation":"#3", "fen":"8/Q1Nb4/1K6/3N2P1/3k2p1/3Bp1R1/1R6/n2n4  w - - 0 1"},
            {"id":"50423", "author": "Callander, Charles", "stipulation":"#3", "fen":"K2N3n/B1R5/7b/3pkB2/4p1Pp/2R1p3/3N3P/3n4  w - - 0 1"},
            {"id":"50424", "author": "Callander, Charles", "stipulation":"#3", "fen":"K5n1/1Q6/4kpN1/4b3/8/B5p1/8/4R3  w - - 0 1"},
            {"id":"50425", "author": "Callander, Charles", "stipulation":"#3", "fen":"8/1K3p2/5P1Q/p1P5/k2pB3/3N1R2/1Pp5/3N4  w - - 0 1"},
            {"id":"50426", "author": "Callander, Charles", "stipulation":"#3", "fen":"B2n4/1b3N2/1P2p2p/2B2N1R/4k2p/Q1p5/2K5/8  w - - 0 1"},
            {"id":"50427", "author": "Coates, William", "stipulation":"#3", "fen":"6Qb/1p1p1nn1/3P2R1/1p3p2/4kP2/1B2p3/2P1N1R1/2K5  w - - 0 1"},
            {"id":"50429", "author": "Coates, William", "stipulation":"#3", "fen":"5B2/8/8/3p3P/N2k3P/1P6/8/K4Q2  w - - 0 1"},
            {"id":"50432", "author": "Deacon, Frederic H.", "stipulation":"#3", "fen":"4RN1b/n3B3/8/r3k3/1NP1p1P1/4P2K/p7/1n6  w - - 0 1"},
            {"id":"50433", "author": "Duffy, Patrick Thomas", "stipulation":"#3", "fen":"1r2B3/8/6nB/1Np1n3/1Nk1K3/8/P1P5/3R4  w - - 0 1"},
            {"id":"50434", "author": "Duffy, Patrick Thomas", "stipulation":"#3", "fen":"8/8/3Bp3/3kN3/4N1p1/2R3P1/8/2K5  w - - 0 1"},
            {"id":"50435", "author": "Duffy, Patrick Thomas", "stipulation":"#3", "fen":"8/3K4/p7/2Pkp1B1/3r4/N7/2Q5/4N3  w - - 0 1"},
            {"id":"50436", "author": "Fawcett, Douglas", "stipulation":"#3", "fen":"8/3K4/2P5/8/2NkB2Q/P7/6P1/8  w - - 0 1"},
            {"id":"50437", "author": "Fawcett, Douglas", "stipulation":"#3", "fen":"7q/1p1p2b1/kB1p1R2/pb1Np3/p3P3/5P2/8/KQ6  w - - 0 1"},
            {"id":"50438", "author": "Fawcett, Douglas", "stipulation":"#3", "fen":"3k2N1/p2p4/3N3R/K2pB3/3P4/5b2/8/8  w - - 0 1"},
            {"id":"50439", "author": "Fawcett, Douglas", "stipulation":"#3", "fen":"7Q/8/8/1p1kNN2/1p6/4Pp2/8/3K4  w - - 0 1"},
            {"id":"50440", "author": "Finlinson, Joseph Henry Scott", "stipulation":"#3", "fen":"8/2BK4/3N3p/3k4/6R1/4p3/4P3/8  w - - 0 1"},
            {"id":"50441", "author": "Finlinson, Joseph Henry Scott", "stipulation":"#3", "fen":"5K2/2p5/Q1N1k3/4P3/P7/7P/6P1/8  w - - 0 1"},
            {"id":"50444", "author": "Finlinson, Joseph Henry Scott", "stipulation":"#3", "fen":"5N2/1B6/R3p1Qp/4P2n/1Np5/2P5/3K1k1P/B4b2  w - - 0 1"},
            {"id":"50445", "author": "Finlinson, Joseph Henry Scott", "stipulation":"#3", "fen":"4K3/4p3/6R1/P2kr3/p2p2P1/3N4/5Pr1/1Q6  w - - 0 1"},
            {"id":"50446", "author": "Finlinson, Joseph Henry Scott", "stipulation":"#3", "fen":"2B4q/K1R2b2/4n2Q/3k4/Pp1rN3/4p3/3n2P1/8  w - - 0 1"},
            {"id":"50447", "author": "Frankenstein, Edward Nathan", "stipulation":"#3", "fen":"4Q3/7p/2p1bN2/2P1k1n1/K3p3/4Np2/8/2B5  w - - 0 1"},
            {"id":"50448", "author": "Frankenstein, Edward Nathan", "stipulation":"#3", "fen":"N7/4b1r1/5p2/4k1Pp/7p/B6Q/B1KP3N/8  w - - 0 1"},
            {"id":"50449", "author": "Frankenstein, Edward Nathan", "stipulation":"#3", "fen":"4r3/2p5/1P2p3/N2pkp2/3R4/1K6/3Q2B1/8  w - - 0 1"},
            {"id":"50450", "author": "Frankenstein, Edward Nathan", "stipulation":"#3", "fen":"8/p7/K2pQ1pp/4p2b/4k3/1p3NP1/1P1Pp3/4N3  w - - 0 1"},
            {"id":"50451", "author": "Frankenstein, Edward Nathan", "stipulation":"#3", "fen":"4R3/N6n/3p4/p2k4/Pb6/1Pn1B3/2PNrR1K/8  w - - 0 1"},
            {"id":"50452", "author": "Freeborough, Edward", "stipulation":"#3", "fen":"rB1N4/3P1B1p/5p1k/8/p4pRK/1b5Q/8/2qr3n  w - - 0 1"},
            {"id":"50453", "author": "Freeborough, Edward", "stipulation":"#3", "fen":"3N4/6p1/1p3kpb/2rpR3/5pP1/2p2p2/5K2/2B1R3  w - - 0 1"},
            {"id":"50455", "author": "Greenwood, William W.", "stipulation":"#3", "fen":"r2nB3/4B1p1/4p3/3bk1N1/n4pK1/3Q4/3P4/8  w - - 0 1"},
            {"id":"50456", "author": "Greenwood, William W.", "stipulation":"#3", "fen":"1n6/3q2B1/3R3Q/2k1N3/6p1/1nN3K1/4P3/8  w - - 0 1"},
            {"id":"50457", "author": "Greenwood, William W.", "stipulation":"#3", "fen":"8/1B6/8/3N4/4kN2/8/Q2K4/8  w - - 0 1"},
            {"id":"50460", "author": "Grimshaw, Walter", "stipulation":"#3", "fen":"5K2/1Q6/2n5/6p1/4NpPb/p7/1p1N4/k7  w - - 0 1"},
            {"id":"50869", "author": "Greenwood, William W.", "stipulation":"#3", "fen":"1BB5/2N5/8/5p2/Q2pk3/2R2N2/p3b2q/K5b1  w - - 0 1"},
            {"id":"50870", "author": "Greenwood, William W.", "stipulation":"#3", "fen":"b2N4/2R1p1Q1/1P1kP1K1/3p2n1/3N4/b1p1n3/7R/1r6  w - - 0 1"},
            {"id":"62101", "author": "Abbott, Joseph William", "stipulation":"#4", "fen":"4bNB1/8/2p4P/3p1k2/QP1Pp2K/n1N5/4Pp2/n7  w - - 0 1"},
            {"id":"62102", "author": "Abbott, Joseph William", "stipulation":"#4", "fen":"8/5p2/3B4/5N2/4p3/4P2k/2R4N/K7  w - - 0 1"},
            {"id":"62103", "author": "Abbott, Joseph William", "stipulation":"#4", "fen":"8/3B4/3N2p1/3kB3/3PR1P1/2p5/2P5/2K5  w - - 0 1"},
            {"id":"62105", "author": "Abbott, Joseph William", "stipulation":"#4", "fen":"7K/6N1/1p4p1/4B1P1/8/3kb1R1/Q5n1/5N1b  w - - 0 1"},
            {"id":"62535", "author": "Smith, Thomas", "stipulation":"#4", "fen":"8/6Kp/7B/1p5k/Rpn5/Q2p1n1B/2b3N1/1r1N4  w - - 0 1"},
            {"id":"62536", "author": "Smith, Thomas", "stipulation":"#4", "fen":"nq6/7R/2b5/2Pn1N2/p1N2p2/P2k1Pp1/2RP4/3B2K1  w - - 0 1"},
            {"id":"62547", "author": "Andrews, Henry John Clinton", "stipulation":"#4", "fen":"r7/n4P1r/p5Qp/2BkN1nK/b2P4/1q3p1B/8/5N2  w - - 0 1"},
            {"id":"62548", "author": "Lord, Frederick William", "stipulation":"#4", "fen":"8/5p2/2K2b1P/8/1P1PkBp1/2PNp1n1/1PB3P1/R7  w - - 0 1"},
            {"id":"62549", "author": "Pavitt, W. S.", "stipulation":"#4", "fen":"8/n2Q4/5Pp1/2pP4/2r5/b1R3p1/R3N1K1/nkN5  w - - 0 1"},
            {"id":"62918", "author": "Ranken, Charles Edward", "stipulation":"#4", "fen":"4k2b/5p1N/KB2pP1P/4N3/1P6/8/8/8  w - - 0 1"},
            {"id":"62923", "author": "Slater, George James", "stipulation":"#4", "fen":"8/6p1/B5P1/7N/p2kP3/B4P2/1p1P4/bK6  w - - 0 1"},
            {"id":"62924", "author": "Slater, George James", "stipulation":"#4", "fen":"4N1bN/2p2rn1/p1R2p2/3Pk3/K1Q4n/P3pr1B/1P6/2B5  w - - 0 1"},
            {"id":"62925", "author": "Slater, George James", "stipulation":"#4", "fen":"8/8/3k4/PB6/1P5K/1P6/1B3P2/4R3  w - - 0 1"},
            {"id":"62926", "author": "Spens, Walter Cook", "stipulation":"#4", "fen":"N3B3/4K3/8/R4p2/5k2/P2p3P/3N3P/2B5  w - - 0 1"},
            {"id":"62929", "author": "Samuel H. THOMAS", "stipulation":"#4", "fen":"rQ1N1n2/p3pPq1/R7/3pn3/5kp1/6Nb/5K1B/1B6  w - - 0 1"},
            {"id":"62931", "author": "Samuel H. THOMAS", "stipulation":"#4", "fen":"R7/3pK1p1/1p1Pp1P1/1p2k3/1P2p1p1/4P1N1/B6B/8  w - - 0 1"},
            {"id":"62932", "author": "Samuel H. THOMAS", "stipulation":"#4", "fen":"7N/3p4/3Pp3/1p2P3/1k2P3/1N6/KP2B2R/8  w - - 0 1"},
            {"id":"62936", "author": "Townsend, A.", "stipulation":"#4", "fen":"8/8/p3p3/p1p1P3/p1k2P1p/P1p1P3/N3P2P/1RB2B1K  w - - 0 1"},
            {"id":"62939", "author": "Turton, Henry", "stipulation":"#4", "fen":"r2n1R2/4N3/2p4b/1Q1p2Rp/4k2N/p4p1K/p4P2/4n3  w - - 0 1"},
            {"id":"62940", "author": "Tyrell, S.", "stipulation":"#4", "fen":"8/p1B2p2/p3p3/P4b1R/Pn1P1N2/1p1pk3/1P1N2R1/1K6  w - - 0 1"},
            {"id":"62941", "author": "Watts, John J.", "stipulation":"#4", "fen":"1q6/b1QN2n1/4k1P1/1rPpnpB1/1pr1N3/4R3/8/1K6  w - - 0 1"},
            {"id":"62942", "author": "Watts, John J.", "stipulation":"#4", "fen":"8/8/8/2pNp3/2B1k1K1/4P3/2P2R2/8  w - - 0 1"},
            {"id":"62943", "author": "Watts, John J.", "stipulation":"#4", "fen":"8/5p2/2rp1p2/1p3Q2/nKbk1P1b/2p5/3P2Nr/3B4  w - - 0 1"},
            {"id":"62944", "author": "Watts, John J.", "stipulation":"#4", "fen":"3B4/4RNp1/1p1N1pbp/p7/nPPk4/2p5/2R1PK2/8  w - - 0 1"},
            {"id":"62945", "author": "W. WAYNE", "stipulation":"#4", "fen":"1q6/3rpb2/2r5/2R4N/1R6/6Q1/5KPp/7k  w - - 0 1"},
            {"id":"62946", "author": "W. WAYNE", "stipulation":"#4", "fen":"5r2/pNp5/K1k1b1p1/5r2/1P5Q/p2R1p2/6q1/4n3  w - - 0 1"},
            {"id":"62947", "author": "W. WAYNE", "stipulation":"#4", "fen":"2rbB3/q7/4R3/1p1N4/1Bk3K1/2P5/4Pp2/2N4n  w - - 0 1"},
            {"id":"62948", "author": "White, Charles W.", "stipulation":"#4", "fen":"8/7n/2N2p2/4Bk1K/1Q6/5P2/q1P2n2/8  w - - 0 1"},
            {"id":"62949", "author": "White, Charles W.", "stipulation":"#4", "fen":"nb5B/7b/Q2p2p1/2pk1pK1/2N1p3/3n4/8/5B2  w - - 0 1"},
            {"id":"62951", "author": "White, Charles W.", "stipulation":"#4", "fen":"2N5/3K2n1/8/P2kp3/R1n3p1/b3BP2/1r5Q/2r4q  w - - 0 1"},
            {"id":"62952", "author": "White, Charles W.", "stipulation":"#4", "fen":"8/4p2p/4p3/4kNN1/8/7P/8/KQ6  w - - 0 1"},
            {"id":"62954", "author": "Wormald, Robert Bownas", "stipulation":"#4", "fen":"8/3Nb3/1B6/2n1p3/2Pk4/3P1P2/2K3P1/2N5  w - - 0 1"},
            {"id":"62957", "author": "Andrews, Henry John Clinton", "stipulation":"#4", "fen":"Nn2k3/B1b1P3/p3BP1p/1r5r/7p/2p5/P3Q1bq/Kn6  w - - 0 1"},
            {"id":"62958", "author": "Baxter, Crichton M.", "stipulation":"#4", "fen":"2n1R1RN/2B1b3/2pr3P/1pkP1n2/6p1/1P1K2p1/2N5/Q7  w - - 0 1"},
            {"id":"62959", "author": "Duffy, Patrick Thomas", "stipulation":"#4", "fen":"1b6/4Q3/3n4/1nN2p1p/1NPpp1b1/5k1p/1q2rP2/3B1K2  w - - 0 1"},
            {"id":"62960", "author": "Coates, William", "stipulation":"#4", "fen":"3N4/5p1K/3p4/Pn1kpPp1/1pR3p1/1p1PB1P1/1P2P3/8  w - - 0 1"},
            {"id":"62961", "author": "Freeborough, Edward", "stipulation":"#4", "fen":"r2R4/3Np2p/n3k2K/Np3R1P/1P6/3P2B1/b2p1P2/2bB4  w - - 0 1"},
            {"id":"62962", "author": "Grimshaw, Walter", "stipulation":"#4", "fen":"5k2/1p2p2p/1n3p2/1PR4B/1B2P1R1/1P2r3/K1P5/8  w - - 0 1"},
            {"id":"62963", "author": "Healey, Frank", "stipulation":"#4", "fen":"1B6/1p6/1Pk5/Pp1nR3/6B1/1N6/3K4/8  w - - 0 1"},
            {"id":"62964", "author": "Heywood, M. C.", "stipulation":"#4", "fen":"n7/3pK3/p2P4/p1k1N2P/P2b4/2P2B2/8/1R1rB3  w - - 0 1"},
            {"id":"62965", "author": "Jordan, M. James", "stipulation":"#4", "fen":"6nB/3n3b/1p1r1p2/1R6/3Nk1p1/N1pp4/5QP1/6K1  w - - 0 1"},
            {"id":"62966", "author": "Lord, Frederick William", "stipulation":"#4", "fen":"2NB4/2p2p2/2Pp1p2/4kP2/p3N1pP/P1R3P1/PpKp4/1BbR4  w - - 0 1"},
            {"id":"62967", "author": "Miles, John Augustus", "stipulation":"#4", "fen":"5r2/R1b4k/5B2/2r5/4N1P1/1Q2P3/p7/1B1n2K1  w - - 0 1"},
            {"id":"62968", "author": "Ranken, Charles Edward", "stipulation":"#4", "fen":"3R4/5k2/4N3/4p1PK/4Bp2/5P2/8/8  w - - 0 1"},
            {"id":"62969", "author": "Pierce, William Timbrell", "stipulation":"#4", "fen":"8/1KnN3p/3k3r/P1Nn4/B3Q3/8/8/b5B1  w - - 0 1"},
            {"id":"62970", "author": "Pierce, William Timbrell", "stipulation":"#4", "fen":"1K2Q3/8/4n1R1/4Pkn1/5p1p/1Pp1pB1p/2P1P2P/8  w - - 0 1"},
            {"id":"62972", "author": "Pierce, William Timbrell", "stipulation":"#4", "fen":"r6r/1BBPnppb/R7/p1R5/pp2nPP1/pP1k4/6P1/N2NK3  w - - 0 1"},
            {"id":"62974", "author": "Pierce, James", "stipulation":"#4", "fen":"b5n1/5R1p/2pNk2p/2P2R2/7N/3P1B1K/2r1P3/8  w - - 0 1"},
            {"id":"62975", "author": "Pierce, James", "stipulation":"#4", "fen":"bn1b3B/1r2pPR1/2r3N1/N1p2P2/n1p5/P1kB3p/R1P1P3/6QK  w - - 0 1"},
            {"id":"62976", "author": "Pierce, James", "stipulation":"#4", "fen":"1n6/3p3K/1ppP1R2/4p1P1/4k1pn/4p2p/4P3/3R1Q2  w - - 0 1"},
            {"id":"62977", "author": "Pierce, James", "stipulation":"#4", "fen":"N7/2p5/n4pK1/1p2kP2/1P4n1/3Q2P1/8/3N4  w - - 0 1"},
            {"id":"62978", "author": "Pierce, James", "stipulation":"#4", "fen":"5b2/8/1KNp1p1p/pP1k1P2/p1bBr2p/3p3p/1Q5P/nnr1N2B  w - - 0 1"},
            {"id":"62979", "author": "Pierce, James", "stipulation":"#4", "fen":"4nr2/2p3r1/2BpP3/3P1p1Q/1Pk2N1p/R1P1p3/p3P2b/Kb2B3  w - - 0 1"},
            {"id":"62980", "author": "Pierce, James", "stipulation":"#4", "fen":"7B/8/4pN1k/2K3n1/pPpN2p1/r3p1P1/1p4B1/BQ6  w - - 0 1"},
            {"id":"62981", "author": "Pearson, Arthur Cyril", "stipulation":"#4", "fen":"1R6/2p1K1p1/2p2pb1/r3kN2/1p2P3/2RP4/Br1bNP2/n4n2  w - - 0 1"},
            {"id":"62983", "author": "Pearson, Arthur Cyril", "stipulation":"#4", "fen":"8/3Kp3/p7/3kr3/2R5/1PPP4/2n5/5R2  w - - 0 1"},
            {"id":"62984", "author": "Pearson, Arthur Cyril", "stipulation":"#4", "fen":"8/2N2BK1/2p5/kpBpp2p/b2P4/8/5N2/5R2  w - - 0 1"},
            {"id":"62985", "author": "Pavitt, W. S.", "stipulation":"#4", "fen":"1K2bN2/8/1pkP4/1n6/1BP5/8/1r1N4/8  w - - 0 1"},
            {"id":"62986", "author": "Pavitt, W. S.", "stipulation":"#4", "fen":"8/1K2n3/3kP3/3p3B/4Q3/3PN3/8/8  w - - 0 1"}
          ]
        }

      };
    });

