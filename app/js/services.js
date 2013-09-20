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
          var moves = gameObj.fenToObject(game.fen()).move;
          return goalMoves - moves + 1
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
            status.situation = ' checkmated.';
          } else if (game.in_draw()) {
            status.situation = ' Drawn.';
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
            status.progress = remaining +  " moves to go";
          }
          return status;
        },

        getBoardConfig: function(scope) {
          return {
            position: scope.problem.position,
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
          }
        },

        fenToObject: function(fen) {
          var parts = fen.split(/\s+/);
          return {
            position: parts[0],
            turn: parts[1] || 'w',
            castle: parts[2] || '-',
            enpassant: parts[3] || '-',
            ply: parts[4] || 0,
            move: parts[5] || 1
          };
        }
      };
    }());

    return gameObj;
  }).
  factory("bookSvc", function() {
      return {
        getFenById: function(id) {
          var fens = this.book.fen;
          var i, flen;
          for (i = 0, flen = fens.length; i < flen; i++) {
            if (fens[i].id === id) {
              return fens[i];
            }
          }
        },
        getNext: function(id) {
          var fens = this.book.fen;
          var i, flen;
          for (i = 0, flen = fens.length; i < flen; i++) {
            if (fens[i].id === id) {
              return (fens[i + 1]) ? fens[i + 1] : null;
            }
          }
        },
        getPrev: function(id) {
          var fens = this.book.fen;
          var i, flen;
          for (i = 0, flen = fens.length; i < flen; i++) {
            if (fens[i].id === id) {
              return (fens[i - 1]) ? fens[i - 1] : null;
            }
          }
        },
        setBook: function(newBook) {
          this.book = newBook;
        },
        book: {
          title: "English Chess Problems",
          authors: ["Abbott, Joseph William"],
          year: "1876",
          fen: [
            {"id":"4", "stipulation": "#2", "position": "7n/3NR3/1P3p2/1p1kbN1B/1p6/1K6/6b1/1Q6 w - - 0 1"},
            {"id":"6", "stipulation": "#2",  "position": "3K4/4B3/3Rp3/8/4pk2/1Qp1Np2/2p2P2/2R5 w - - 0 1"},
            {"id":"2118", "stipulation":"#2", "position":"3N4/7r/N2p4/1p1k1p2/4qP2/1KB3P1/Q5B1/2b5  w - - 0 1"},
            {"id":"2119", "stipulation":"#2", "position":"1B6/2NQ4/P5p1/KR2PpP1/2b1qk2/5PRP/1p1P1N1P/1B6  w - - 0 1"},
            {"id":"2125", "stipulation":"#2", "position":"8/KBp1p3/P1PkP3/2NN1Qp1/1B1q1prb/2P2Pp1/3R2P1/8  w - - 0 1"},
            {"id":"7326", "stipulation":"#2", "position":"Q5bn/4r3/2pR1R2/1pK1k3/4p1BN/2p1P1n1/3N4/8  w - - 0 1"},
            {"id":"10165", "stipulation":"#2", "position":"1b6/8/4KB2/8/6N1/Q3RPk1/6p1/6N1  w - - 0 1"},
            {"id":"15213", "stipulation":"#2", "position":"b2b4/Rn1B2B1/RnPk1p2/p1N5/P3P3/5N2/1Q6/7K  w - - 0 1"},
            {"id":"17204", "stipulation":"#2", "position":"5N2/3B1p2/2Np1n2/1K1k3r/3pn2b/4pQ2/2P5/8  w - - 0 1"},
            {"id":"33009", "stipulation":"#2", "position":"3K1R1n/2P2bB1/3P1Np1/1n2k1p1/3q1NP1/3R1B2/Q6P/8  w - - 0 1"},
            {"id":"33011", "stipulation":"#2", "position":"4N3/3Q4/q3P3/p4r2/3Pk3/2n1N1P1/B2RPP2/K7  w - - 0 1"},
            {"id":"33012", "stipulation":"#2", "position":"Q1n5/1rR5/1p1NK1p1/r1b2PP1/2BkbR2/BPp1p2p/6qP/4N1n1  w - - 0 1"},
            {"id":"33013", "stipulation":"#2", "position":"Q7/1N1q4/4RB2/3kr1P1/2n5/4R1N1/B7/6K1  w - - 0 1"},
            {"id":"33017", "stipulation":"#2", "position":"q1R4B/8/2b3Q1/3kN2p/BP6/2n1p3/2R5/2n4K  w - - 0 1"},
            {"id":"33019", "stipulation":"#2", "position":"8/3bKN2/2B3P1/2P3R1/2P2k2/4p3/3n4/2QRqnB1  w - - 0 1"},
            {"id":"33020", "stipulation":"#2", "position":"8/3p2b1/2pB1P2/n7/p2kPP2/R1n2K2/QNP5/8  w - - 0 1"},
            {"id":"33021", "stipulation":"#2", "position":"B3RK1b/5N2/3pNp1P/1pqn1k1P/1P4p1/2Rp2B1/Q3P3/8  w - - 0 1"},
            {"id":"33022", "stipulation":"#2", "position":"1BNbb3/7Q/5PP1/1n1P1krR/3R1pN1/4p2P/1Kn2r2/1B6  w - - 0 1"},
            {"id":"33024", "stipulation":"#2", "position":"1B1RQ3/1p6/2b5/1p1q4/1N1k3r/2r1n3/1n1NK2p/2R5  w - - 0 1"},
            {"id":"33025", "stipulation":"#2", "position":"3Rr3/4P3/1Pk1P3/Pp6/4N3/b3KB2/2ppP3/2q4n  w - - 0 1"},
            {"id":"33027", "stipulation":"#2", "position":"8/8/2N2p2/2P1p3/Qp2k3/1K2B2P/2N2P2/1B6  w - - 0 1"},
            {"id":"33028", "stipulation":"#2", "position":"3R4/6Q1/pr1b1p2/Nn2kbR1/pPB5/P4P1N/4p1K1/4B3  w - - 0 1"},
            {"id":"33029", "stipulation":"#2", "position":"5RK1/pk6/bP2R3/5p2/2N5/1n1p3p/Q5N1/5q1B  w - - 0 1"},
            {"id":"33030", "stipulation":"#2", "position":"4r3/p1P1p2n/6RK/rkN2R2/1p6/1P1p4/5BB1/8  w - - 0 1"},
            {"id":"33031", "stipulation":"#2", "position":"3NR1B1/1p2P3/3b4/4k1K1/QRb1P1p1/2pPn3/5B1N/8  w - - 0 1"},
            {"id":"47507", "stipulation":"#3", "position":"5B2/8/6p1/3P4/1Npk1p2/n3N2B/5Q2/5K2  w - - 0 1"},
            {"id":"47508", "stipulation":"#3", "position":"2KR4/3p1N2/3pB3/2p1p1R1/3kP3/3p2P1/P2B4/8  w - - 0 1"},
            {"id":"47511", "stipulation":"#3", "position":"4K3/8/3k4/2RbN3/1p1P4/nR3p1B/8/Q7  w - - 0 1"},
            {"id":"47512", "stipulation":"#3", "position":"3Q4/8/2pNp2P/1p6/3k1N2/6P1/3P4/K3B2n  w - - 0 1"},
            {"id":"47513", "stipulation":"#3", "position":"8/1r6/pp3N2/8/B1kB4/2P1p3/3pP1n1/3K1Q1b  w - - 0 1"},
            {"id":"47514", "stipulation":"#3", "position":"2Rb4/1Q1nk3/n1pNb2p/2p4N/2P1R1pK/4P1B1/8/8  w - - 0 1"},
            {"id":"47515", "stipulation":"#3", "position":"3K4/8/3Npp2/3kB2Q/8/3Pp1P1/8/8  w - - 0 1"},
            {"id":"47516", "stipulation":"#3", "position":"6K1/8/N4RP1/4R2Q/3p4/3k1B2/1np5/2B5  w - - 0 1"},
            {"id":"49298", "stipulation":"#3", "position":"8/8/1Q6/2p1b3/2Nk4/P2B4/2P5/7K  w - - 0 1"},
            {"id":"49302", "stipulation":"#3", "position":"8/3N2n1/p7/Q7/4k1n1/2K1p2N/4B1rP/8  w - - 0 1"},
            {"id":"49304", "stipulation":"#3", "position":"2k1N3/2B3p1/1P4p1/4R1K1/8/8/8/7B  w - - 0 1"},
            {"id":"49306", "stipulation":"#3", "position":"nN2Q3/4p1n1/pp1b2K1/r3k3/b3pN2/4P3/8/8  w - - 0 1"},
            {"id":"50251", "stipulation":"#3", "position":"8/p5r1/Qb5n/1n1Bp1RP/5k1K/4Np2/2P5/4R3  w - - 0 1"},
            {"id":"50252", "stipulation":"#3", "position":"7b/3p2B1/1K2R3/3k4/8/3b2P1/8/1N2nQ2  w - - 0 1"},
            {"id":"50253", "stipulation":"#3", "position":"1K6/5p2/4b3/2pRN3/1pN4p/1Pk3B1/P5n1/1Bn5  w - - 0 1"},
            {"id":"50254", "stipulation":"#3", "position":"3B4/1p6/1K6/4kp2/2p2N2/8/3Q4/1b1N4  w - - 0 1"},
            {"id":"50255", "stipulation":"#3", "position":"2K5/4pN1B/4k2r/p7/8/2N1pQ2/4R3/bb3n2  w - - 0 1"},
            {"id":"50256", "stipulation":"#3", "position":"8/4p1p1/4Kp2/8/2p1kN2/3bN1Q1/1b6/8  w - - 0 1"},
            {"id":"50257", "stipulation":"#3", "position":"8/8/2N5/1Q3N2/3Pkb1r/6p1/6P1/Kb6  w - - 0 1"},
            {"id":"50259", "stipulation":"#3", "position":"4n3/b3r3/2N2p2/1N1n4/2B3R1/4k3/4p1P1/4K3  w - - 0 1"},
            {"id":"50260", "stipulation":"#3", "position":"3q2N1/3bp3/7R/5k2/3Qp2K/4P3/8/8  w - - 0 1"},
            {"id":"50261", "stipulation":"#3", "position":"8/4pR1K/4N1p1/7k/2q4p/8/8/7Q  w - - 0 1"},
            {"id":"50262", "stipulation":"#3", "position":"8/6p1/nBp1p3/4k1K1/8/N1Np2p1/1n4B1/8  w - - 0 1"},
            {"id":"50263", "stipulation":"#3", "position":"nB2Q3/1p1Rpp2/2p1k3/1p4P1/1P2r3/1P2P3/6N1/R4K1B  w - - 0 1"},
            {"id":"50264", "stipulation":"#3", "position":"8/Nb6/4p2Q/b1P1pk2/1P1np2p/7P/1KnPPN2/2B5  w - - 0 1"},
            {"id":"50265", "stipulation":"#3", "position":"Q7/1N2p3/2r1Pp2/2pN4/1pP5/1n2B3/p1KP4/k7  w - - 0 1"},
            {"id":"50266", "stipulation":"#3", "position":"nb3Q2/4K2p/3PN3/P1p1p2r/R1N1k1P1/B1p3p1/B3P1qR/1b5n  w - - 0 1"},
            {"id":"50267", "stipulation":"#3", "position":"K3Q1N1/3Bn2r/1BPp1p2/3pk1b1/3R4/1PR2P2/2PPn1P1/8  w - - 0 1"},
            {"id":"50268", "stipulation":"#3", "position":"4Q3/8/pP6/P2N1k1N/5B1P/2p1P3/2p5/2K5  w - - 0 1"},
            {"id":"50269", "stipulation":"#3", "position":"1K6/5B1p/4N2k/4p3/4Pq2/6p1/4R3/2B5  w - - 0 1"},
            {"id":"50270", "stipulation":"#3", "position":"K7/2p4p/7Q/1p1pp3/1P2k1p1/4N3/Pb2PR2/7b  w - - 0 1"},
            {"id":"50271", "stipulation":"#3", "position":"4K3/1p1p1B2/3k1b1p/p2P4/2R2Pn1/3N2p1/8/5Q2  w - - 0 1"},
            {"id":"50272", "stipulation":"#3", "position":"8/3N4/4R3/1QP2k1K/1P3p2/4qr1p/4N3/6b1  w - - 0 1"},
            {"id":"50273", "stipulation":"#3", "position":"B3K3/8/1p1k4/5R1p/3N1n2/1Nb5/5Qn1/2rb4  w - - 0 1"},
            {"id":"50274", "stipulation":"#3", "position":"N7/pp6/n2r4/1K1k4/4R2Q/1Pb1P3/8/2q5  w - - 0 1"},
            {"id":"50275", "stipulation":"#3", "position":"qR2rkn1/4R2B/2N2n2/8/2bN1Q1b/5p2/p7/K7  w - - 0 1"},
            {"id":"50276", "stipulation":"#3", "position":"5R2/2prn1b1/q1Nk2P1/1rRP4/4Q3/6N1/B1n4K/3b4  w - - 0 1"},
            {"id":"50277", "stipulation":"#3", "position":"3B1brr/1K2p2p/P3k1PN/3p4/3P3P/5p2/5P2/5Q2  w - - 0 1"},
            {"id":"50278", "stipulation":"#3", "position":"8/p7/7Q/n1kp4/p6R/N7/2K3p1/7n  w - - 0 1"},
            {"id":"50279", "stipulation":"#3", "position":"3nq3/6r1/1Rp1k1p1/1bB3P1/2N1K1N1/2b1Q3/B6r/8  w - - 0 1"},
            {"id":"50280", "stipulation":"#3", "position":"5n2/4B2p/4p2P/3pk3/2Pp2KN/5Ppp/3Nq3/3Q1b1r  w - - 0 1"},
            {"id":"50282", "stipulation":"#3", "position":"7K/4B3/2p5/N2pkB2/Q3P3/1r3R2/2r5/2N5  w - - 0 1"},
            {"id":"50283", "stipulation":"#3", "position":"6n1/4pb2/4R2p/4P2P/4Nkp1/3Qp1N1/4P3/K7  w - - 0 1"},
            {"id":"50285", "stipulation":"#3", "position":"R2B1r1q/1pr4n/1k3bQR/p1pPp3/2P1NP2/3B3p/P7/K6b  w - - 0 1"},
            {"id":"50286", "stipulation":"#3", "position":"4B1N1/7p/5pnP/5p1k/4pPRp/7p/4P2B/5K2  w - - 0 1"},
            {"id":"50287", "stipulation":"#3", "position":"4Q3/4N3/2Bkp3/K5p1/p2pp3/6P1/8/3b2b1  w - - 0 1"},
            {"id":"50288", "stipulation":"#3", "position":"5KQ1/8/n4N2/1p6/kP6/p1B5/8/8  w - - 0 1"},
            {"id":"50289", "stipulation":"#3", "position":"1Q6/4K3/8/5Bk1/3ppp2/nR6/8/2b5  w - - 0 1"},
            {"id":"50290", "stipulation":"#3", "position":"8/8/8/1p6/Np2p3/kp2NQ2/2p3K1/8  w - - 0 1"},
            {"id":"50291", "stipulation":"#3", "position":"4n3/8/5b2/4p1Q1/K2Np3/3kB3/4R3/8  w - - 0 1"},
            {"id":"50292", "stipulation":"#3", "position":"8/3b4/1pp1p3/2k5/1pPN4/3K4/1BQ5/8  w - - 0 1"},
            {"id":"50293", "stipulation":"#3", "position":"3b2K1/3pp3/q1p5/1b5k/3N2p1/8/3Q3P/4B3  w - - 0 1"},
            {"id":"50294", "stipulation":"#3", "position":"3N2n1/p5rp/1N2p2n/1P2p1Q1/4k3/6P1/4K3/6B1  w - - 0 1"},
            {"id":"50295", "stipulation":"#3", "position":"8/3R4/5p1K/3b1k2/8/4P2p/1BR2N2/7q  w - - 0 1"},
            {"id":"50296", "stipulation":"#3", "position":"3q4/1Q4B1/8/p7/P3R2N/1b1k4/4pP1r/2n1K2n  w - - 0 1"},
            {"id":"50298", "stipulation":"#3", "position":"4Q2n/1r2P2r/2B5/2Bn1p2/b3k1p1/1p1N4/4P3/1Kb5  w - - 0 1"},
            {"id":"50299", "stipulation":"#3", "position":"8/7p/6bR/1Pk3N1/1N2RBP1/8/K1P5/5B2  w - - 0 1"},
            {"id":"50301", "stipulation":"#3", "position":"4K2k/1R2N1p1/6B1/4b3/p4p2/p2n4/7r/1Q6  w - - 0 1"},
            {"id":"50302", "stipulation":"#3", "position":"8/p7/8/4kN2/8/1K1Q1P2/5P2/2B5  w - - 0 1"},
            {"id":"50304", "stipulation":"#3", "position":"1b1n3q/2N2n2/p6r/p2p3b/3k4/B4p2/3K4/1Q3B2  w - - 0 1"},
            {"id":"50305", "stipulation":"#3", "position":"8/3n2K1/1p4Q1/4k3/R3Np2/1P2b1B1/8/1b5B  w - - 0 1"},
            {"id":"50308", "stipulation":"#3", "position":"3Nb3/p5qr/B4R2/k1pN4/n7/1P3pPQ/5P1p/R3b2K  w - - 0 1"},
            {"id":"50309", "stipulation":"#3", "position":"5Q2/Rn4br/2pp3p/4kb2/R1B1pN1B/p2ppP2/1N6/7K  w - - 0 1"},
            {"id":"50310", "stipulation":"#3", "position":"5QBq/2N4n/3B1p1R/8/2p1k1pK/1p6/1p3p2/3bbN2  w - - 0 1"},
            {"id":"50311", "stipulation":"#3", "position":"R1n5/3Nb3/3pK3/3P4/3pk1P1/4p2N/2b1P1p1/Q7  w - - 0 1"},
            {"id":"50312", "stipulation":"#3", "position":"4Q3/n4ppN/3p3b/3k4/3N1q1R/1K1Pp3/7B/3R4  w - - 0 1"},
            {"id":"50313", "stipulation":"#3", "position":"n4B2/2p5/1pP1K3/7B/pN1kp1P1/p6Q/P2pP3/2bR4  w - - 0 1"},
            {"id":"50314", "stipulation":"#3", "position":"8/5p2/QKb1kP2/2P2R2/8/P7/2P5/B1n2N2  w - - 0 1"},
            {"id":"50315", "stipulation":"#3", "position":"6b1/5nQp/1N1p3p/1B1pq2R/1P1kp3/6P1/K2P1N2/8  w - - 0 1"},
            {"id":"50316", "stipulation":"#3", "position":"1B1N1N2/2r1p1p1/n2kB3/P1q1R3/3p3P/3P4/3QbK2/8  w - - 0 1"},
            {"id":"50317", "stipulation":"#3", "position":"8/1Np5/4n3/N4R1p/4k2P/n5KB/3PP3/8  w - - 0 1"},
            {"id":"50318", "stipulation":"#3", "position":"4nrk1/1r3pp1/3p1qp1/3N2P1/5N2/pBp5/K1P1Q2R/8  w - - 0 1"},
            {"id":"50319", "stipulation":"#3", "position":"7Q/8/3p4/7p/4k2P/3Np3/1K2P3/8  w - - 0 1"},
            {"id":"50320", "stipulation":"#3", "position":"2n5/8/4Kp2/B2N4/1Ppkp3/2R4p/q6P/5Nn1  w - - 0 1"},
            {"id":"50321", "stipulation":"#3", "position":"6B1/p1n5/ppp1q1R1/2Pkp3/8/3PK3/1N6/2R1B3  w - - 0 1"},
            {"id":"50322", "stipulation":"#3", "position":"8/B2p4/4k1B1/1N2b2P/P2pR2Q/Kn1n4/1R2N3/8  w - - 0 1"},
            {"id":"50323", "stipulation":"#3", "position":"4QB2/8/3p4/3kp3/8/4p3/p3B3/K7  w - - 0 1"},
            {"id":"50324", "stipulation":"#3", "position":"1rn5/B1p2R2/1p3P2/p1p5/3kp1R1/2pN4/B4Nbn/K1Q5  w - - 0 1"},
            {"id":"50325", "stipulation":"#3", "position":"2n5/2Q3B1/2pn1p2/2PP1P2/4kPp1/2PN2R1/4B3/4K3  w - - 0 1"},
            {"id":"50326", "stipulation":"#3", "position":"R7/5Pbp/R2Bk3/3p2PB/8/2N3pq/1N4bn/KQ6  w - - 0 1"},
            {"id":"50327", "stipulation":"#3", "position":"6n1/8/4k1Kp/2P1PN1P/8/7Q/8/8  w - - 0 1"},
            {"id":"50328", "stipulation":"#3", "position":"1R1K1n2/r2P4/R1pk4/p1N1p3/3N1PQn/8/B2Br3/7q  w - - 0 1"},
            {"id":"50329", "stipulation":"#3", "position":"5Q2/6pr/2P1P3/1N2pP1P/P2bk1NR/Bp4P1/n3P3/5K2  w - - 0 1"},
            {"id":"50330", "stipulation":"#3", "position":"3R4/8/8/1P1b4/3k4/8/1K1B4/3Q4  w - - 0 1"},
            {"id":"50332", "stipulation":"#3", "position":"2N5/3N1R2/8/pP1kB3/P1p5/2p5/2K5/8  w - - 0 1"},
            {"id":"50333", "stipulation":"#3", "position":"1b1R4/1Q6/3qp2n/2p3p1/PP1k4/1P1Br2P/1N2R3/B2K1n2  w - - 0 1"},
            {"id":"50334", "stipulation":"#3", "position":"2R5/8/3p2p1/1p1p4/R1rkpBp1/2n2bP1/pN3P2/KnNq2Q1  w - - 0 1"},
            {"id":"50335", "stipulation":"#3", "position":"k7/np1N1K2/2pp4/1n6/1NQ5/8/1b6/R7  w - - 0 1"},
            {"id":"50337", "stipulation":"#3", "position":"6r1/3QN3/Pp2p3/8/2k2r2/KN5b/5n2/4B3  w - - 0 1"},
            {"id":"50338", "stipulation":"#3", "position":"r1r5/3R3b/p6P/4p3/5p2/K1k2Nn1/RNp1p2Q/8  w - - 0 1"},
            {"id":"50339", "stipulation":"#3", "position":"8/2p3pp/2P1p1n1/3rk2N/1Q2Pp2/5P2/BK5B/4N3  w - - 0 1"},
            {"id":"50340", "stipulation":"#3", "position":"8/1p1K1pQ1/4Pr2/P2k3p/1R1b4/3P4/3B4/8  w - - 0 1"},
            {"id":"50342", "stipulation":"#3", "position":"4R3/1p3n2/n7/p7/3k4/P2P4/3K4/4Q3  w - - 0 1"},
            {"id":"50344", "stipulation":"#3", "position":"5k2/4rpRr/3N3p/7P/8/4Q3/8/5R1K  w - - 0 1"},
            {"id":"50345", "stipulation":"#3", "position":"8/8/2pN4/2Pk3K/8/1P4Q1/8/8  w - - 0 1"},
            {"id":"50346", "stipulation":"#3", "position":"r6n/7Q/4Bp2/nqp5/2p1N1p1/pk5b/N1R5/6K1  w - - 0 1"},
            {"id":"50347", "stipulation":"#3", "position":"6n1/2p3pb/2N2p1b/B2P2p1/3Kp1k1/4p1Pp/7P/5QR1  w - - 0 1"},
            {"id":"50348", "stipulation":"#3", "position":"2nK4/5N2/2p2p2/2p2p2/2kp1B2/5P2/P2Q2R1/1R1N4  w - - 0 1"},
            {"id":"50349", "stipulation":"#3", "position":"7B/5pb1/3K1kp1/2p2Bp1/1n6/2p3N1/7n/3Q4  w - - 0 1"},
            {"id":"50350", "stipulation":"#3", "position":"8/1p6/1N1pp3/kp2P3/PN1Q4/b2K4/8/1R4B1  w - - 0 1"},
            {"id":"50351", "stipulation":"#3", "position":"K2b4/8/B1NnP2Q/7p/k4p1r/p3Np2/P7/3b1R2  w - - 0 1"},
            {"id":"50352", "stipulation":"#3", "position":"7K/3b4/1n1P2RB/2P1kp2/1N5P/1Pp2P2/2N1P3/2n5  w - - 0 1"},
            {"id":"50353", "stipulation":"#3", "position":"4R2n/8/2p5/3b1Np1/Ppk2bP1/1N2p3/KP2P3/4B3  w - - 0 1"},
            {"id":"50357", "stipulation":"#3", "position":"5q1b/1pB2n2/8/1p3Q2/1R2p3/1PkN4/2P5/2K5  w - - 0 1"},
            {"id":"50358", "stipulation":"#3", "position":"8/3R4/4K3/1p2bN2/4kpn1/5b1Q/B7/4r3  w - - 0 1"},
            {"id":"50361", "stipulation":"#3", "position":"8/K6R/1pR3Nr/3kn1p1/P2N4/3P2B1/8/7q  w - - 0 1"},
            {"id":"50362", "stipulation":"#3", "position":"RK6/PpPkp2N/4bp2/3P1Pb1/1r1Q3r/n7/4B2q/8  w - - 0 1"},
            {"id":"50363", "stipulation":"#3", "position":"N2nNn2/Pp2p2p/4k3/6pK/3R4/5P2/bBQ4b/1r3r2  w - - 0 1"},
            {"id":"50364", "stipulation":"#3", "position":"2K5/7P/5p1Q/1kp5/3p4/p7/P7/3BB3  w - - 0 1"},
            {"id":"50365", "stipulation":"#3", "position":"B3K1kr/5p1r/7p/6NN/4P3/8/8/B7  w - - 0 1"},
            {"id":"50369", "stipulation":"#3", "position":"8/8/2p2p2/2k5/4R3/8/3KB3/7Q  w - - 0 1"},
            {"id":"50370", "stipulation":"#3", "position":"1Q3K2/2R5/4Np2/3NB3/4k2P/3p4/3P4/8  w - - 0 1"},
            {"id":"50371", "stipulation":"#3", "position":"1Nn4N/3R2Kn/4pr2/1b1pkpp1/p3P3/B1P5/6PP/5Q2  w - - 0 1"},
            {"id":"50372", "stipulation":"#3", "position":"6Bk/3p2p1/3Pp3/2P1KpN1/3N2RP/2B5/4Q3/8  w - - 0 1"},
            {"id":"50373", "stipulation":"#3", "position":"8/pp1Bk2K/8/2p1p1P1/8/r2P1Q2/3B3p/7r  w - - 0 1"},
            {"id":"50374", "stipulation":"#3", "position":"8/6K1/3R4/2RNk3/6p1/2N3P1/3P1pr1/n5b1  w - - 0 1"},
            {"id":"50375", "stipulation":"#3", "position":"5Q2/8/2K2Pp1/8/2N5/2P3b1/2P1k3/6R1  w - - 0 1"},
            {"id":"50376", "stipulation":"#3", "position":"2K5/1pP2pN1/1Bk1nR2/p4p2/p4P2/P7/2P4p/2Q2Bbr  w - - 0 1"},
            {"id":"50378", "stipulation":"#3", "position":"5Q2/8/4p3/4kp2/1P1ppRp1/6p1/2P3P1/K2R4  w - - 0 1"},
            {"id":"50379", "stipulation":"#3", "position":"8/5nNb/3B2kp/3P1R1p/7P/2K1p1P1/4B3/8  w - - 0 1"},
            {"id":"50381", "stipulation":"#3", "position":"4rb2/1B5p/1p4p1/2R5/3kpN2/B3N1P1/4K3/n7  w - - 0 1"},
            {"id":"50382", "stipulation":"#3", "position":"1b2N3/p2B2nq/p1Rp2r1/P2k2p1/3P2P1/1P2B3/8/KQ6  w - - 0 1"},
            {"id":"50383", "stipulation":"#3", "position":"7q/6n1/4pbB1/2P2r2/1P1pkNp1/3Nn1P1/1KP1RR2/Q7  w - - 0 1"},
            {"id":"50384", "stipulation":"#3", "position":"3RQ3/5p2/1B6/2Npb2q/1Rnk4/8/b2P3p/n3N2K  w - - 0 1"},
            {"id":"50385", "stipulation":"#3", "position":"2b3N1/rpr2R2/3p1Bp1/6p1/N4kP1/n1p2P1P/5K2/1B6  w - - 0 1"},
            {"id":"50386", "stipulation":"#3", "position":"4N3/2Pr4/4p3/3Nkp2/3p4/K2P4/3Q3P/8  w - - 0 1"},
            {"id":"50387", "stipulation":"#3", "position":"8/4B1pK/1P2R3/p2k4/B1RN4/3p1p2/4b3/5n2  w - - 0 1"},
            {"id":"50388", "stipulation":"#3", "position":"b7/8/2p1NNp1/4kn1R/2Q2p2/8/8/1K6  w - - 0 1"},
            {"id":"50389", "stipulation":"#3", "position":"8/2p5/2Q5/3pp3/1N4K1/4k3/8/1B6  w - - 0 1"},
            {"id":"50390", "stipulation":"#3", "position":"b7/p3pK2/Q3N1p1/2p3P1/1N2kBP1/1p2p3/1n2B3/1n2b3  w - - 0 1"},
            {"id":"50392", "stipulation":"#3", "position":"6qB/r2k1p1R/1P2N3/4K3/1Q1Nn1Bb/8/8/8  w - - 0 1"},
            {"id":"50393", "stipulation":"#3", "position":"8/8/2p1N3/2P3p1/1PN2pP1/p2k1K2/B2B4/8  w - - 0 1"},
            {"id":"50395", "stipulation":"#3", "position":"2N3B1/8/8/K6R/Rp1k1p2/3n1P2/3P4/8  w - - 0 1"},
            {"id":"50396", "stipulation":"#3", "position":"3Q4/3p2K1/p6p/P3R3/3k1n1p/1PN3B1/8/2q1N3  w - - 0 1"},
            {"id":"50397", "stipulation":"#3", "position":"1b1n4/Qpr2N2/N3p3/3p4/3p4/3k3B/2RB4/4K2n  w - - 0 1"},
            {"id":"50398", "stipulation":"#3", "position":"Q7/5B2/2pK4/3Npk2/1n2Nb1p/5R2/2bP3P/8  w - - 0 1"},
            {"id":"50399", "stipulation":"#3", "position":"2R5/3N1K2/1p6/1p1p2p1/pQnk2P1/P7/8/1Bb2N2  w - - 0 1"},
            {"id":"50400", "stipulation":"#3", "position":"8/5Q2/5np1/5k2/8/3P4/6RB/4K3  w - - 0 1"},
            {"id":"50401", "stipulation":"#3", "position":"8/8/Q7/2p1b3/2Nk4/P2B4/2P5/7K  w - - 0 1"},
            {"id":"50404", "stipulation":"#3", "position":"4K3/1pp3b1/4k1N1/q1PR2p1/8/1B2P3/1B3r2/3r1N1b  w - - 0 1"},
            {"id":"50407", "stipulation":"#3", "position":"4B1Q1/2pr2p1/5nR1/P3kP2/2bN3p/4K2P/2R5/4B3  w - - 0 1"},
            {"id":"50408", "stipulation":"#3", "position":"1r6/1p1Q3p/R5n1/1p2p3/B1n1kBp1/1NP5/KP2Pq2/4R1r1  w - - 0 1"},
            {"id":"50418", "stipulation":"#3", "position":"3N4/5pp1/8/B1kpP1nQ/2pN1P2/3B4/8/1KR5  w - - 0 1"},
            {"id":"50421", "stipulation":"#3", "position":"4n2b/1p6/1P1N2P1/3kpN1R/K1p5/3p4/3Q4/4R3  w - - 0 1"},
            {"id":"50422", "stipulation":"#3", "position":"8/Q1Nb4/1K6/3N2P1/3k2p1/3Bp1R1/1R6/n2n4  w - - 0 1"},
            {"id":"50423", "stipulation":"#3", "position":"K2N3n/B1R5/7b/3pkB2/4p1Pp/2R1p3/3N3P/3n4  w - - 0 1"},
            {"id":"50424", "stipulation":"#3", "position":"K5n1/1Q6/4kpN1/4b3/8/B5p1/8/4R3  w - - 0 1"},
            {"id":"50425", "stipulation":"#3", "position":"8/1K3p2/5P1Q/p1P5/k2pB3/3N1R2/1Pp5/3N4  w - - 0 1"},
            {"id":"50426", "stipulation":"#3", "position":"B2n4/1b3N2/1P2p2p/2B2N1R/4k2p/Q1p5/2K5/8  w - - 0 1"},
            {"id":"50427", "stipulation":"#3", "position":"6Qb/1p1p1nn1/3P2R1/1p3p2/4kP2/1B2p3/2P1N1R1/2K5  w - - 0 1"},
            {"id":"50429", "stipulation":"#3", "position":"5B2/8/8/3p3P/N2k3P/1P6/8/K4Q2  w - - 0 1"},
            {"id":"50432", "stipulation":"#3", "position":"4RN1b/n3B3/8/r3k3/1NP1p1P1/4P2K/p7/1n6  w - - 0 1"},
            {"id":"50433", "stipulation":"#3", "position":"1r2B3/8/6nB/1Np1n3/1Nk1K3/8/P1P5/3R4  w - - 0 1"},
            {"id":"50434", "stipulation":"#3", "position":"8/8/3Bp3/3kN3/4N1p1/2R3P1/8/2K5  w - - 0 1"},
            {"id":"50435", "stipulation":"#3", "position":"8/3K4/p7/2Pkp1B1/3r4/N7/2Q5/4N3  w - - 0 1"},
            {"id":"50436", "stipulation":"#3", "position":"8/3K4/2P5/8/2NkB2Q/P7/6P1/8  w - - 0 1"},
            {"id":"50437", "stipulation":"#3", "position":"7q/1p1p2b1/kB1p1R2/pb1Np3/p3P3/5P2/8/KQ6  w - - 0 1"},
            {"id":"50438", "stipulation":"#3", "position":"3k2N1/p2p4/3N3R/K2pB3/3P4/5b2/8/8  w - - 0 1"},
            {"id":"50439", "stipulation":"#3", "position":"7Q/8/8/1p1kNN2/1p6/4Pp2/8/3K4  w - - 0 1"},
            {"id":"50440", "stipulation":"#3", "position":"8/2BK4/3N3p/3k4/6R1/4p3/4P3/8  w - - 0 1"},
            {"id":"50441", "stipulation":"#3", "position":"5K2/2p5/Q1N1k3/4P3/P7/7P/6P1/8  w - - 0 1"},
            {"id":"50444", "stipulation":"#3", "position":"5N2/1B6/R3p1Qp/4P2n/1Np5/2P5/3K1k1P/B4b2  w - - 0 1"},
            {"id":"50445", "stipulation":"#3", "position":"4K3/4p3/6R1/P2kr3/p2p2P1/3N4/5Pr1/1Q6  w - - 0 1"},
            {"id":"50446", "stipulation":"#3", "position":"2B4q/K1R2b2/4n2Q/3k4/Pp1rN3/4p3/3n2P1/8  w - - 0 1"},
            {"id":"50447", "stipulation":"#3", "position":"4Q3/7p/2p1bN2/2P1k1n1/K3p3/4Np2/8/2B5  w - - 0 1"},
            {"id":"50448", "stipulation":"#3", "position":"N7/4b1r1/5p2/4k1Pp/7p/B6Q/B1KP3N/8  w - - 0 1"},
            {"id":"50449", "stipulation":"#3", "position":"4r3/2p5/1P2p3/N2pkp2/3R4/1K6/3Q2B1/8  w - - 0 1"},
            {"id":"50450", "stipulation":"#3", "position":"8/p7/K2pQ1pp/4p2b/4k3/1p3NP1/1P1Pp3/4N3  w - - 0 1"},
            {"id":"50451", "stipulation":"#3", "position":"4R3/N6n/3p4/p2k4/Pb6/1Pn1B3/2PNrR1K/8  w - - 0 1"},
            {"id":"50452", "stipulation":"#3", "position":"rB1N4/3P1B1p/5p1k/8/p4pRK/1b5Q/8/2qr3n  w - - 0 1"},
            {"id":"50453", "stipulation":"#3", "position":"3N4/6p1/1p3kpb/2rpR3/5pP1/2p2p2/5K2/2B1R3  w - - 0 1"},
            {"id":"50455", "stipulation":"#3", "position":"r2nB3/4B1p1/4p3/3bk1N1/n4pK1/3Q4/3P4/8  w - - 0 1"},
            {"id":"50456", "stipulation":"#3", "position":"1n6/3q2B1/3R3Q/2k1N3/6p1/1nN3K1/4P3/8  w - - 0 1"},
            {"id":"50457", "stipulation":"#3", "position":"8/1B6/8/3N4/4kN2/8/Q2K4/8  w - - 0 1"},
            {"id":"50460", "stipulation":"#3", "position":"5K2/1Q6/2n5/6p1/4NpPb/p7/1p1N4/k7  w - - 0 1"},
            {"id":"50869", "stipulation":"#3", "position":"1BB5/2N5/8/5p2/Q2pk3/2R2N2/p3b2q/K5b1  w - - 0 1"},
            {"id":"50870", "stipulation":"#3", "position":"b2N4/2R1p1Q1/1P1kP1K1/3p2n1/3N4/b1p1n3/7R/1r6  w - - 0 1"},
            {"id":"62101", "stipulation":"#4", "position":"4bNB1/8/2p4P/3p1k2/QP1Pp2K/n1N5/4Pp2/n7  w - - 0 1"},
            {"id":"62102", "stipulation":"#4", "position":"8/5p2/3B4/5N2/4p3/4P2k/2R4N/K7  w - - 0 1"},
            {"id":"62103", "stipulation":"#4", "position":"8/3B4/3N2p1/3kB3/3PR1P1/2p5/2P5/2K5  w - - 0 1"},
            {"id":"62105", "stipulation":"#4", "position":"7K/6N1/1p4p1/4B1P1/8/3kb1R1/Q5n1/5N1b  w - - 0 1"},
            {"id":"62535", "stipulation":"#4", "position":"8/6Kp/7B/1p5k/Rpn5/Q2p1n1B/2b3N1/1r1N4  w - - 0 1"},
            {"id":"62536", "stipulation":"#4", "position":"nq6/7R/2b5/2Pn1N2/p1N2p2/P2k1Pp1/2RP4/3B2K1  w - - 0 1"},
            {"id":"62547", "stipulation":"#4", "position":"r7/n4P1r/p5Qp/2BkN1nK/b2P4/1q3p1B/8/5N2  w - - 0 1"},
            {"id":"62548", "stipulation":"#4", "position":"8/5p2/2K2b1P/8/1P1PkBp1/2PNp1n1/1PB3P1/R7  w - - 0 1"},
            {"id":"62549", "stipulation":"#4", "position":"8/n2Q4/5Pp1/2pP4/2r5/b1R3p1/R3N1K1/nkN5  w - - 0 1"},
            {"id":"62918", "stipulation":"#4", "position":"4k2b/5p1N/KB2pP1P/4N3/1P6/8/8/8  w - - 0 1"},
            {"id":"62923", "stipulation":"#4", "position":"8/6p1/B5P1/7N/p2kP3/B4P2/1p1P4/bK6  w - - 0 1"},
            {"id":"62924", "stipulation":"#4", "position":"4N1bN/2p2rn1/p1R2p2/3Pk3/K1Q4n/P3pr1B/1P6/2B5  w - - 0 1"},
            {"id":"62925", "stipulation":"#4", "position":"8/8/3k4/PB6/1P5K/1P6/1B3P2/4R3  w - - 0 1"},
            {"id":"62926", "stipulation":"#4", "position":"N3B3/4K3/8/R4p2/5k2/P2p3P/3N3P/2B5  w - - 0 1"},
            {"id":"62929", "stipulation":"#4", "position":"rQ1N1n2/p3pPq1/R7/3pn3/5kp1/6Nb/5K1B/1B6  w - - 0 1"},
            {"id":"62931", "stipulation":"#4", "position":"R7/3pK1p1/1p1Pp1P1/1p2k3/1P2p1p1/4P1N1/B6B/8  w - - 0 1"},
            {"id":"62932", "stipulation":"#4", "position":"7N/3p4/3Pp3/1p2P3/1k2P3/1N6/KP2B2R/8  w - - 0 1"},
            {"id":"62936", "stipulation":"#4", "position":"8/8/p3p3/p1p1P3/p1k2P1p/P1p1P3/N3P2P/1RB2B1K  w - - 0 1"},
            {"id":"62939", "stipulation":"#4", "position":"r2n1R2/4N3/2p4b/1Q1p2Rp/4k2N/p4p1K/p4P2/4n3  w - - 0 1"},
            {"id":"62940", "stipulation":"#4", "position":"8/p1B2p2/p3p3/P4b1R/Pn1P1N2/1p1pk3/1P1N2R1/1K6  w - - 0 1"},
            {"id":"62941", "stipulation":"#4", "position":"1q6/b1QN2n1/4k1P1/1rPpnpB1/1pr1N3/4R3/8/1K6  w - - 0 1"},
            {"id":"62942", "stipulation":"#4", "position":"8/8/8/2pNp3/2B1k1K1/4P3/2P2R2/8  w - - 0 1"},
            {"id":"62943", "stipulation":"#4", "position":"8/5p2/2rp1p2/1p3Q2/nKbk1P1b/2p5/3P2Nr/3B4  w - - 0 1"},
            {"id":"62944", "stipulation":"#4", "position":"3B4/4RNp1/1p1N1pbp/p7/nPPk4/2p5/2R1PK2/8  w - - 0 1"},
            {"id":"62945", "stipulation":"#4", "position":"1q6/3rpb2/2r5/2R4N/1R6/6Q1/5KPp/7k  w - - 0 1"},
            {"id":"62946", "stipulation":"#4", "position":"5r2/pNp5/K1k1b1p1/5r2/1P5Q/p2R1p2/6q1/4n3  w - - 0 1"},
            {"id":"62947", "stipulation":"#4", "position":"2rbB3/q7/4R3/1p1N4/1Bk3K1/2P5/4Pp2/2N4n  w - - 0 1"},
            {"id":"62948", "stipulation":"#4", "position":"8/7n/2N2p2/4Bk1K/1Q6/5P2/q1P2n2/8  w - - 0 1"},
            {"id":"62949", "stipulation":"#4", "position":"nb5B/7b/Q2p2p1/2pk1pK1/2N1p3/3n4/8/5B2  w - - 0 1"},
            {"id":"62951", "stipulation":"#4", "position":"2N5/3K2n1/8/P2kp3/R1n3p1/b3BP2/1r5Q/2r4q  w - - 0 1"},
            {"id":"62952", "stipulation":"#4", "position":"8/4p2p/4p3/4kNN1/8/7P/8/KQ6  w - - 0 1"},
            {"id":"62954", "stipulation":"#4", "position":"8/3Nb3/1B6/2n1p3/2Pk4/3P1P2/2K3P1/2N5  w - - 0 1"},
            {"id":"62957", "stipulation":"#4", "position":"Nn2k3/B1b1P3/p3BP1p/1r5r/7p/2p5/P3Q1bq/Kn6  w - - 0 1"},
            {"id":"62958", "stipulation":"#4", "position":"2n1R1RN/2B1b3/2pr3P/1pkP1n2/6p1/1P1K2p1/2N5/Q7  w - - 0 1"},
            {"id":"62959", "stipulation":"#4", "position":"1b6/4Q3/3n4/1nN2p1p/1NPpp1b1/5k1p/1q2rP2/3B1K2  w - - 0 1"},
            {"id":"62960", "stipulation":"#4", "position":"3N4/5p1K/3p4/Pn1kpPp1/1pR3p1/1p1PB1P1/1P2P3/8  w - - 0 1"},
            {"id":"62961", "stipulation":"#4", "position":"r2R4/3Np2p/n3k2K/Np3R1P/1P6/3P2B1/b2p1P2/2bB4  w - - 0 1"},
            {"id":"62962", "stipulation":"#4", "position":"5k2/1p2p2p/1n3p2/1PR4B/1B2P1R1/1P2r3/K1P5/8  w - - 0 1"},
            {"id":"62963", "stipulation":"#4", "position":"1B6/1p6/1Pk5/Pp1nR3/6B1/1N6/3K4/8  w - - 0 1"},
            {"id":"62964", "stipulation":"#4", "position":"n7/3pK3/p2P4/p1k1N2P/P2b4/2P2B2/8/1R1rB3  w - - 0 1"},
            {"id":"62965", "stipulation":"#4", "position":"6nB/3n3b/1p1r1p2/1R6/3Nk1p1/N1pp4/5QP1/6K1  w - - 0 1"},
            {"id":"62966", "stipulation":"#4", "position":"2NB4/2p2p2/2Pp1p2/4kP2/p3N1pP/P1R3P1/PpKp4/1BbR4  w - - 0 1"},
            {"id":"62967", "stipulation":"#4", "position":"5r2/R1b4k/5B2/2r5/4N1P1/1Q2P3/p7/1B1n2K1  w - - 0 1"},
            {"id":"62968", "stipulation":"#4", "position":"3R4/5k2/4N3/4p1PK/4Bp2/5P2/8/8  w - - 0 1"},
            {"id":"62969", "stipulation":"#4", "position":"8/1KnN3p/3k3r/P1Nn4/B3Q3/8/8/b5B1  w - - 0 1"},
            {"id":"62970", "stipulation":"#4", "position":"1K2Q3/8/4n1R1/4Pkn1/5p1p/1Pp1pB1p/2P1P2P/8  w - - 0 1"},
            {"id":"62972", "stipulation":"#4", "position":"r6r/1BBPnppb/R7/p1R5/pp2nPP1/pP1k4/6P1/N2NK3  w - - 0 1"},
            {"id":"62974", "stipulation":"#4", "position":"b5n1/5R1p/2pNk2p/2P2R2/7N/3P1B1K/2r1P3/8  w - - 0 1"},
            {"id":"62975", "stipulation":"#4", "position":"bn1b3B/1r2pPR1/2r3N1/N1p2P2/n1p5/P1kB3p/R1P1P3/6QK  w - - 0 1"},
            {"id":"62976", "stipulation":"#4", "position":"1n6/3p3K/1ppP1R2/4p1P1/4k1pn/4p2p/4P3/3R1Q2  w - - 0 1"},
            {"id":"62977", "stipulation":"#4", "position":"N7/2p5/n4pK1/1p2kP2/1P4n1/3Q2P1/8/3N4  w - - 0 1"},
            {"id":"62978", "stipulation":"#4", "position":"5b2/8/1KNp1p1p/pP1k1P2/p1bBr2p/3p3p/1Q5P/nnr1N2B  w - - 0 1"},
            {"id":"62979", "stipulation":"#4", "position":"4nr2/2p3r1/2BpP3/3P1p1Q/1Pk2N1p/R1P1p3/p3P2b/Kb2B3  w - - 0 1"},
            {"id":"62980", "stipulation":"#4", "position":"7B/8/4pN1k/2K3n1/pPpN2p1/r3p1P1/1p4B1/BQ6  w - - 0 1"},
            {"id":"62981", "stipulation":"#4", "position":"1R6/2p1K1p1/2p2pb1/r3kN2/1p2P3/2RP4/Br1bNP2/n4n2  w - - 0 1"},
            {"id":"62983", "stipulation":"#4", "position":"8/3Kp3/p7/3kr3/2R5/1PPP4/2n5/5R2  w - - 0 1"},
            {"id":"62984", "stipulation":"#4", "position":"8/2N2BK1/2p5/kpBpp2p/b2P4/8/5N2/5R2  w - - 0 1"},
            {"id":"62985", "stipulation":"#4", "position":"1K2bN2/8/1pkP4/1n6/1BP5/8/1r1N4/8  w - - 0 1"},
            {"id":"62986", "stipulation":"#4", "position":"8/1K2n3/3kP3/3p3B/4Q3/3PN3/8/8  w - - 0 1"},
            {"id":"62987", "stipulation":"#4", "position":"8/2p1p1p1/2B3P1/2NPk3/6PP/R1P5/2K3N1/8  w - - 0 1"},
            {"id":"62988", "stipulation":"#4", "position":"R5b1/8/3K1pP1/1P1p4/2pk4/4p3/1P2PNP1/1B6  w - - 0 1"},
            {"id":"62989", "stipulation":"#4", "position":"5Q2/2n5/p2q3p/Kpk3pR/1N1p4/3P4/4P2r/2B2b2  w - - 0 1"},
            {"id":"62990", "stipulation":"#4", "position":"8/5K1N/pb1p1Ppp/1R2pk1p/B2r3P/6B1/r2n1NP1/n4Q2  w - - 0 1"},
            {"id":"62991", "stipulation":"#4", "position":"1KN5/8/2k1P3/2p3pb/1pP4r/p3N1p1/5Q1P/2n4q  w - - 0 1"},
            {"id":"62992", "stipulation":"#4", "position":"8/4B3/pnB3rN/Kp1ppp2/1Pk5/p2pP3/P4PQ1/3N4  w - - 0 1"},
            {"id":"62995", "stipulation":"#4", "position":"Q6B/8/8/6P1/P4k2/8/1NN5/3K4  w - - 0 1"},
            {"id":"62996", "stipulation":"#4", "position":"6n1/B3b3/2p5/2Pk4/6P1/3K4/5N2/5Q2  w - - 0 1"},
            {"id":"62997", "stipulation":"#4", "position":"3R1n2/1KN2pp1/pn5r/2k1N3/5P2/2Bp4/5R2/r1b5  w - - 0 1"},
            {"id":"62998", "stipulation":"#4", "position":"8/1pNp1q2/1K1kb1N1/1R1p1n1p/7B/8/5P2/8  w - - 0 1"},
            {"id":"62999", "stipulation":"#4", "position":"1K2b3/3p4/p2k1P2/P2P2p1/QN1PPq2/2R5/1p2p3/Nr2r1B1  w - - 0 1"},
            {"id":"63000", "stipulation":"#4", "position":"3r1b2/1p2p1p1/1P1N4/1K1k1N1P/3p4/5PQ1/8/8  w - - 0 1"},
            {"id":"63004", "stipulation":"#4", "position":"r7/2N3Rp/3p1k2/p2K1p1p/P4b2/1n5r/5B1P/6Q1  w - - 0 1"},
            {"id":"63010", "stipulation":"#4", "position":"4K3/8/6p1/2p2kP1/2P2B2/5PR1/8/6N1  w - - 0 1"},
            {"id":"63011", "stipulation":"#4", "position":"4r2B/p1Q2b2/2R3n1/3pr3/4k2p/3N2P1/2B1K3/q7  w - - 0 1"},
            {"id":"63013", "stipulation":"#4", "position":"1b5K/1R3B2/1p2pp1k/1Pr1r3/R1b5/B2N1NP1/3PP2p/3Q4  w - - 0 1"},
            {"id":"63014", "stipulation":"#4", "position":"7K/3Bk3/R2N4/1P6/3P2P1/8/3P4/8  w - - 0 1"},
            {"id":"63015", "stipulation":"#4", "position":"7N/8/8/2pp1K1p/2nkP1np/3PpQ1P/1P2B3/8  w - - 0 1"},
            {"id":"63016", "stipulation":"#4", "position":"8/6K1/2B2p2/n2nkN2/1pb4Q/2b3p1/1q1R1P1R/8  w - - 0 1"},
            {"id":"63017", "stipulation":"#4", "position":"6K1/2p5/2N5/8/4p2P/3k2p1/P2N2P1/6Q1  w - - 0 1"},
            {"id":"63018", "stipulation":"#4", "position":"8/6p1/6p1/6P1/1P1k2P1/2N1p2p/4P2K/Q1B5  w - - 0 1"},
            {"id":"63019", "stipulation":"#4", "position":"7n/2N2p1K/5RP1/1b5B/p2Pkp1B/P1Pn4/2N5/3R4  w - - 0 1"},
            {"id":"63022", "stipulation":"#4", "position":"5rN1/3b3r/R5p1/3pkPp1/3N2n1/3P2Pp/1B6/1K3B2  w - - 0 1"},
            {"id":"63024", "stipulation":"#4", "position":"1B6/6n1/1Q2R3/5k2/8/5P2/1p2p3/2b1K3  w - - 0 1"},
            {"id":"63025", "stipulation":"#4", "position":"K3R3/3p4/2pp4/3k4/5B2/2P2N2/1pP5/1N6  w - - 0 1"},
            {"id":"63026", "stipulation":"#4", "position":"B1r3bB/2P5/1Qp3kP/1n1N4/8/1p5K/5R2/8  w - - 0 1"},
            {"id":"63027", "stipulation":"#4", "position":"K2R4/pp1BpbQr/3bN1pn/2P5/1PpNkP2/q6n/4PP1B/4R3  w - - 0 1"},
            {"id":"63028", "stipulation":"#4", "position":"7b/5q2/1NP1P3/pBpP2B1/K1P2PR1/PNk4r/1p1R3p/1Qrn4  w - - 0 1"},
            {"id":"63029", "stipulation":"#4", "position":"1r1N2b1/2b2p2/8/1P1Rp3/4k1B1/3RB3/5K2/8  w - - 0 1"},
            {"id":"63030", "stipulation":"#4", "position":"8/8/4p3/4Pp2/n3k3/3N3Q/1P3B2/K7  w - - 0 1"},
            {"id":"63031", "stipulation":"#4", "position":"1bbB1K2/1p6/3pP3/3NkpNR/1Prp4/3B1p2/1nP4P/8  w - - 0 1"},
            {"id":"63033", "stipulation":"#4", "position":"b7/8/5p2/5N2/P1kP3Q/K1p5/2P5/5n2  w - - 0 1"},
            {"id":"63034", "stipulation":"#4", "position":"8/1K1p1p2/3kpB2/8/2P1P3/8/2N5/2N5  w - - 0 1"},
            {"id":"63036", "stipulation":"#4", "position":"8/4K2p/2N3pP/B2k2P1/2pp1P2/1pP5/1P1N4/1B6  w - - 0 1"},
            {"id":"63037", "stipulation":"#4", "position":"8/8/2K5/1pNp4/2kp1n2/8/1P2PN2/1R6  w - - 0 1"},
            {"id":"63038", "stipulation":"#4", "position":"q7/3Q4/8/8/5pR1/p4k1p/P1P2b1K/1n3R2  w - - 0 1"},
            {"id":"63039", "stipulation":"#4", "position":"8/8/p7/2Bpp2N/K3k1nb/1Q3Rp1/4p3/4n3  w - - 0 1"},
            {"id":"63041", "stipulation":"#4", "position":"7B/rp1p2R1/r3pk1p/b4p1p/4P2P/n1Pp3K/1Q1p4/1B3n2  w - - 0 1"},
            {"id":"63042", "stipulation":"#4", "position":"r6b/pp6/2pn3p/1P2R2P/QB1k1N2/1p1P1Kn1/b2N1P2/1r6  w - - 0 1"},
            {"id":"63043", "stipulation":"#4", "position":"q3br1N/5p1p/npP2b2/6Bk/2BQp2P/5N1p/8/3K4  w - - 0 1"},
            {"id":"63046", "stipulation":"#4", "position":"3b1N1n/2R4B/7p/4R1Bk/1n4N1/1b4P1/8/6K1  w - - 0 1"},
            {"id":"63047", "stipulation":"#4", "position":"4N3/1p4Rn/p3k2B/R3p3/7K/4N3/3P4/3r1n2  w - - 0 1"},
            {"id":"63049", "stipulation":"#4", "position":"5k2/bb3N1K/2nNp3/3p4/B7/qn4P1/5B2/5Q2  w - - 0 1"},
            {"id":"63050", "stipulation":"#4", "position":"8/p3p3/7N/4k3/3N2p1/3Q4/8/K3Bn2  w - - 0 1"},
            {"id":"63051", "stipulation":"#4", "position":"n3b3/1Qp5/p4n2/3B4/1R6/4N3/2p5/r1k1K3  w - - 0 1"},
            {"id":"63052", "stipulation":"#4", "position":"3nr2r/8/5R1N/b1p5/R1BNk3/5b2/n2P3B/4K3  w - - 0 1"},
            {"id":"63053", "stipulation":"#4", "position":"2b2B2/8/p1PNqp2/k7/3p4/K1Pp1B1P/R7/1R6  w - - 0 1"},
            {"id":"63054", "stipulation":"#4", "position":"k1r4R/Bb6/1P3P2/N2n4/3pN3/1p6/6Q1/1K6  w - - 0 1"},
            {"id":"63055", "stipulation":"#4", "position":"5R2/2N5/b7/6RK/qpP1kB2/p3p1P1/4Bn2/2b5  w - - 0 1"},
            {"id":"63056", "stipulation":"#4", "position":"bb5R/2p5/2p3p1/2R1K1k1/p2nP1Bp/B5pP/n5N1/7N  w - - 0 1"},
            {"id":"63057", "stipulation":"#4", "position":"2B1r1r1/8/P1p5/B1P2R2/4bP2/1p5R/1Kp5/2Nk4  w - - 0 1"},
            {"id":"63058", "stipulation":"#4", "position":"3r4/2pbr3/P6p/1R6/Q2p4/3Nk3/2pRP3/2K4B  w - - 0 1"},
            {"id":"63059", "stipulation":"#4", "position":"Q7/1r2q3/1n2rb1p/3p1R1P/P2p4/3Nk3/4P3/3K3B  w - - 0 1"},
            {"id":"63061", "stipulation":"#4", "position":"n4b1q/2p2Qn1/K1k1r2R/6N1/pP2P1b1/3B4/R4r2/2B5  w - - 0 1"},
            {"id":"63062", "stipulation":"#4", "position":"8/bp3b2/2p1p1r1/N2kPPp1/P1p5/8/K1P1R1P1/Q7  w - - 0 1"},
            {"id":"63063", "stipulation":"#4", "position":"2b4r/4R3/1B1p4/2p4p/5k1K/2r2p2/5P1n/7Q  w - - 0 1"},
            {"id":"63064", "stipulation":"#4", "position":"8/3nK3/2b4P/3pkN1r/2R1r3/8/3Qn2P/1B4B1  w - - 0 1"},
            {"id":"63065", "stipulation":"#4", "position":"3N4/8/1p1PR3/1Pp3b1/2K5/B2Pp3/n1k1P1pP/1N4R1  w - - 0 1"},
            {"id":"63066", "stipulation":"#4", "position":"1K2n3/p1B2Q1p/k2P4/4p2r/1pP2N2/2n5/1b2B1r1/4qb2  w - - 0 1"},
            {"id":"63067", "stipulation":"#4", "position":"8/K7/p3p1P1/2pk1p2/2N2P2/3Bpb2/8/2QN2r1  w - - 0 1"},
            {"id":"63068", "stipulation":"#4", "position":"8/7n/1b2N2K/1Ppk1pB1/2N1pP2/2nP1B1p/4P2P/6Q1  w - - 0 1"},
            {"id":"63069", "stipulation":"#4", "position":"q3B3/2r5/1Nbp1pQ1/2N1k1p1/1rp5/4B2P/7P/2n2K2  w - - 0 1"},
            {"id":"63070", "stipulation":"#4", "position":"2Bn4/4b2q/R2p1p2/2p1k3/4b3/2K1N2n/3P4/6Q1  w - - 0 1"},
            {"id":"63071", "stipulation":"#4", "position":"1K6/8/BB1pp2n/1Rpb1NPr/2p1k1p1/3N4/2Q1P2b/8  w - - 0 1"},
            {"id":"63072", "stipulation":"#4", "position":"1b6/n7/2p5/r1B1p2K/B4kP1/3R2p1/3P4/2N5  w - - 0 1"},
            {"id":"63073", "stipulation":"#4", "position":"8/8/1N1P4/3pp3/7Q/1p1kb3/1Pr2PP1/1B3K2  w - - 0 1"},
            {"id":"63074", "stipulation":"#4", "position":"BK5n/3p4/1p1P3N/p3k1P1/1B2P3/1PR1P3/8/3b4  w - - 0 1"},
            {"id":"63079", "stipulation":"#4", "position":"5k1b/3K3p/7N/3N1P2/Q5P1/3p4/1P1P4/5q2  w - - 0 1"},
            {"id":"63080", "stipulation":"#4", "position":"6r1/Np3b2/1R3Bnn/5k1N/1p3PpP/1p1P2K1/1P6/8  w - - 0 1"},
            {"id":"63081", "stipulation":"#4", "position":"2bN4/r2p2p1/r1pp2pp/p2k2BR/5p2/1N1Bb3/4P3/2R4K  w - - 0 1"},
            {"id":"63082", "stipulation":"#4", "position":"8/2n1B1bp/1p6/2p1kp2/rp3N2/n4PP1/B2N1K2/7R  w - - 0 1"},
            {"id":"63083", "stipulation":"#4", "position":"1rk5/1p1r4/8/qNp2Pp1/B1P1NBK1/1n6/1Q6/8  w - - 0 1"},
            {"id":"63084", "stipulation":"#4", "position":"K1B5/8/3R2P1/2p5/2P1NN2/4k1P1/1P4P1/8  w - - 0 1"},
            {"id":"63085", "stipulation":"#4", "position":"1R6/p3N3/1bp4K/1P1N2p1/p1k5/8/2B1P1p1/2R5  w - - 0 1"},
            {"id":"63087", "stipulation":"#4", "position":"8/5p2/1PR5/1K3P2/3p2N1/P2k1Pp1/1P1p2P1/3B4  w - - 0 1"},
            {"id":"63088", "stipulation":"#4", "position":"8/4B3/4P3/3kpQ2/7p/4P2p/6NP/2N3K1  w - - 0 1"},
            {"id":"63090", "stipulation":"#4", "position":"1N5N/6Q1/4k3/8/p3p3/P3P3/6P1/5K2  w - - 0 1"},
            {"id":"63091", "stipulation":"#4", "position":"2BK4/n3R1p1/2pk4/p1RN3P/3p4/pP1p4/5P2/bN6  w - - 0 1"},
            {"id":"63092", "stipulation":"#4", "position":"1B2K3/3R4/N1p1kp1n/3p4/Bn2p2P/2N1p2r/8/6bq  w - - 0 1"},
            {"id":"63093", "stipulation":"#4", "position":"5R1n/2b1rn1Q/Kp2p3/1p5b/3kBp2/3Pp1p1/8/2R1N3  w - - 0 1"},
            {"id":"63094", "stipulation":"#4", "position":"B6B/2brp3/2Nn1R2/3b1P1p/1p4P1/1P2k1pN/2Q5/K7  w - - 0 1"},
            {"id":"63095", "stipulation":"#4", "position":"8/2p4p/N1P4P/4R3/1P3P2/3kB3/Bp6/1K6  w - - 0 1"},
            {"id":"63097", "stipulation":"#4", "position":"7k/4p1p1/p5P1/8/8/3n4/Q3P3/Kb2r1R1  w - - 0 1"},
            {"id":"63098", "stipulation":"#4", "position":"3K1R2/8/3pk3/4p3/1N6/8/7B/8  w - - 0 1"},
            {"id":"63099", "stipulation":"#4", "position":"n7/1r5b/2RBk2N/4p1p1/4r1N1/3n4/3P1Q2/K3b3  w - - 0 1"},
            {"id":"63100", "stipulation":"#4", "position":"3q1r2/1BQ1p2R/1r6/1p4p1/R3N1kp/1p2K3/8/8  w - - 0 1"},
            {"id":"63101", "stipulation":"#4", "position":"1Q2bb2/4N1nq/nN2p3/1p5r/4kP1p/4P3/2P1K1R1/8  w - - 0 1"},
            {"id":"63102", "stipulation":"#4", "position":"2b4q/4r2r/1R5P/4k1p1/3N1pP1/7B/p2Q2n1/K5B1  w - - 0 1"},
            {"id":"63103", "stipulation":"#4", "position":"5n2/3r1r2/n2R4/Np2kp2/6Rp/Q2B4/3K3P/8  w - - 0 1"},
            {"id":"63104", "stipulation":"#4", "position":"2r2r1q/8/n6p/Q2N1k2/5N1P/2p2K2/8/5B2  w - - 0 1"},
            {"id":"63105", "stipulation":"#4", "position":"rk4K1/p1R3p1/2pP4/4bpR1/1N1n3Q/r4n1b/1pP5/6q1  w - - 0 1"},
            {"id":"63106", "stipulation":"#4", "position":"1K1k3r/1R3PN1/2pp2P1/2P2p2/1Bq5/1n2pn1b/8/2b3Q1  w - - 0 1"},
            {"id":"63111", "stipulation":"#4", "position":"5q1k/5p1p/5NbR/8/1p6/pP6/P7/K5R1  w - - 0 1"},
            {"id":"63113", "stipulation":"#4", "position":"8/1nK3p1/8/p2Np3/2p1P1Bp/2PkN1p1/b7/4R3  w - - 0 1"},
            {"id":"63114", "stipulation":"#4", "position":"4b3/1r1n2pp/1p4k1/3P1RN1/6P1/3B4/7K/8  w - - 0 1"},
            {"id":"63115", "stipulation":"#4", "position":"KQ6/6p1/3p2P1/7p/3Pk1bR/PN6/2P2P2/8  w - - 0 1"},
            {"id":"63116", "stipulation":"#4", "position":"2Q5/1n1p1n1p/2b1B1pp/8/p2p2R1/2b2k1N/5P2/3K4  w - - 0 1"},
            {"id":"63117", "stipulation":"#4", "position":"1B2n3/8/p1P5/1n1Np2K/2p1k3/Q4R1p/2q1P1p1/1R2b1r1  w - - 0 1"},
            {"id":"63118", "stipulation":"#4", "position":"2B5/6rn/1Q6/3k2pp/2b1N3/8/6R1/7K  w - - 0 1"},
            {"id":"63119", "stipulation":"#4", "position":"8/4N3/p3p3/P3k3/2P1Np2/2PP1p2/3Kn3/5R1B  w - - 0 1"},
            {"id":"63120", "stipulation":"#4", "position":"3b4/5R2/2p1N1R1/3k4/4b3/3p2P1/3Q3K/1n6  w - - 0 1"},
            {"id":"63122", "stipulation":"#4", "position":"5N2/8/3q1p1b/3ppPpk/1n4p1/6R1/4P1PK/Q3B3  w - - 0 1"},
            {"id":"63123", "stipulation":"#4", "position":"2b1QR2/1p2P3/p3npN1/5k1P/4n2K/8/2p1Pp2/8  w - - 0 1"},
            {"id":"63124", "stipulation":"#4", "position":"3n1qrb/2p4Q/2p3p1/1n2R3/1rNp3P/Pp1k1p1b/1K1N1B2/3R4  w - - 0 1"},
            {"id":"63125", "stipulation":"#4", "position":"4r3/r1P2p1B/5R2/2pNk3/3pPp1p/5R1N/PB4n1/1K5n  w - - 0 1"},
            {"id":"63244", "stipulation":"#4", "position":"2R1n3/7Q/B3b3/r1bk1N2/6rR/3N2B1/4K3/8  w - - 0 1"},
            {"id":"63245", "stipulation":"#4", "position":"5R2/5N1p/1P2k3/5pB1/p1p2K2/3p4/3Pp1BP/5R2  w - - 0 1"},
            {"id":"63686", "stipulation":"#4", "position":"5rN1/3b2r1/R5p1/3pkPp1/3N2n1/3P2Pp/1B6/1K3B2  w - - 0 1"},
            {"id":"65584", "stipulation":"#5", "position":"8/1bK3p1/p3p3/2nk2r1/5R2/2P2R2/3P1N2/b1B5  w - - 0 1"},
            {"id":"65585", "stipulation":"#5", "position":"k1K2nB1/p6p/N7/r3b3/N1pP4/r6Q/6R1/q7  w - - 0 1"},
            {"id":"65586", "stipulation":"#5", "position":"8/1pB3p1/6Pp/2N1p2P/2P1Pk2/4p3/1P2K3/6R1  w - - 0 1"},
            {"id":"65587", "stipulation":"#5", "position":"8/2K2R2/4k3/4N1p1/1NP3p1/6P1/3P4/8  w - - 0 1"},
            {"id":"65589", "stipulation":"#5", "position":"8/1B2n1K1/5B2/2r2kNp/3p1PpR/1P2n1P1/p5N1/1b2R1b1  w - - 0 1"},
            {"id":"65590", "stipulation":"#5", "position":"8/n2p4/2p2K2/3k4/1pRN4/1P3P1p/1B4n1/8  w - - 0 1"},
            {"id":"65591", "stipulation":"#5", "position":"r2n3b/1n2K3/2p1pp2/2N1k1P1/4p3/B1P1N1P1/Q1p5/q2r4  w - - 0 1"},
            {"id":"65593", "stipulation":"#5", "position":"1r1q1rB1/Q5p1/1pnp1p1p/b1N1k1N1/7P/4P3/1n4P1/3bB2K  w - - 0 1"},
            {"id":"65594", "stipulation":"#5", "position":"3nq3/1n2rQp1/N1pB1pp1/p6r/P1PkP2N/P2B1R1P/3K4/8  w - - 0 1"},
            {"id":"65595", "stipulation":"#5", "position":"1R3K2/8/k1N1p1B1/3p4/p5qp/6p1/1P1P2R1/4B3  w - - 0 1"},
            {"id":"65596", "stipulation":"#5", "position":"1qr5/2p1p2p/8/6N1/n3b2K/Q1r2pN1/2Pk1p2/n1R5  w - - 0 1"},
            {"id":"65597", "stipulation":"#5", "position":"7n/5pp1/N7/4p1q1/p1Npk1B1/3R3p/7B/1K6  w - - 0 1"},
            {"id":"65598", "stipulation":"#5", "position":"8/3NK3/8/8/P2k4/1P1B4/3PP3/8  w - - 0 1"},
            {"id":"65599", "stipulation":"#5", "position":"8/1p2p1p1/3pP3/RK1kN1Np/3P4/8/1P5P/8  w - - 0 1"},
            {"id":"65600", "stipulation":"#5", "position":"3nR3/1p3p1Q/1Bk1nN2/K1P1P2p/3P2N1/1p3bpP/4r2q/5B2  w - - 0 1"},
            {"id":"65601", "stipulation":"#5", "position":"8/2p5/2R5/5p2/3pk2b/3Nn2P/2PP4/3BR2K  w - - 0 1"},
            {"id":"65602", "stipulation":"#5", "position":"bb6/4p3/q3P1R1/PPB1kp2/n1p1NN2/p4Q2/r3PP1K/2Rnr3  w - - 0 1"},
            {"id":"65603", "stipulation":"#5", "position":"2bR4/r3nKN1/1p1N2p1/2p1P1p1/2Bk4/6Q1/r2B4/1q1n4  w - - 0 1"},
            {"id":"65604", "stipulation":"#5", "position":"n4bq1/4p3/2p4R/K1k1pN2/3N4/1PP2b1r/8/1n4B1  w - - 0 1"},
            {"id":"65605", "stipulation":"#5", "position":"bn6/r7/3bpB1P/3p4/N1P2kPp/1rp1R2p/Q2p1P1K/n2B1R2  w - - 0 1"},
            {"id":"65606", "stipulation":"#5", "position":"r1n3Q1/2B5/1n1bK3/1PkP1R2/Pp5p/P1pB1p2/1qp1P2p/1R2N2b  w - - 0 1"},
            {"id":"65607", "stipulation":"#5", "position":"5nB1/rbpN2p1/2qp3p/4n2P/P2BkP1N/3pP1K1/Q5R1/8  w - - 0 1"},
            {"id":"65608", "stipulation":"#5", "position":"8/2R5/k7/prP5/b1B1p3/1pN2p2/1P1K4/8  w - - 0 1"},
            {"id":"65609", "stipulation":"#5", "position":"8/3p4/3b4/2pN2Q1/2kN4/P2pP3/5pPq/K4b2  w - - 0 1"},
            {"id":"65610", "stipulation":"#5", "position":"8/1p1p1K2/8/1PpN4/2p1kB2/2P1p3/4P3/8  w - - 0 1"},
            {"id":"65612", "stipulation":"#5", "position":"1K1R4/7p/2pN3B/4p3/6P1/2Pk4/8/3B4  w - - 0 1"},
            {"id":"65613", "stipulation":"#5", "position":"1r3b2/p2nR1r1/Rpkp3p/3N1N1q/2pK1Bn1/Pb4Q1/1P2B3/8  w - - 0 1"},
            {"id":"65616", "stipulation":"#5", "position":"8/4N3/6K1/3B1N2/5k2/7P/8/8  w - - 0 1"},
            {"id":"65617", "stipulation":"#5", "position":"7B/3p3K/3p2R1/1p1N1k2/1P2pP1p/7p/1NB3P1/bqr4r  w - - 0 1"},
            {"id":"65618", "stipulation":"#5", "position":"8/5p2/2K1kP2/4p1BB/1p4P1/1P2p3/1nR2N2/bb6  w - - 0 1"},
            {"id":"65684", "stipulation":"#5", "position":"1r6/n4n2/ppbPpb2/4k3/1Q1NP1p1/6P1/5R2/3NK1B1  w - - 0 1"},
            {"id":"65685", "stipulation":"#5", "position":"1R4K1/8/k1N1p1B1/3p4/p5qp/6p1/1P1P2R1/4B3  w - - 0 1"},
            {"id":"66712", "stipulation":"#6", "position":"8/8/kNP2b2/1p6/1P2P2r/K1p3R1/2p1nQ2/2N2Bnq  w - - 0 1"},
            {"id":"66713", "stipulation":"#6", "position":"k1K5/1p4p1/2p5/pP3R2/2P5/5pr1/3P2rb/4R3  w - - 0 1"},
            {"id":"66714", "stipulation":"#6", "position":"7b/1q5r/6N1/1n1n3Q/3p1pR1/1BP1kP2/p3P1P1/4BK2  w - - 0 1"},
            {"id":"66715", "stipulation":"#6", "position":"1b1Q4/4N1p1/6P1/1r4k1/3P1n2/2p2K2/1p4P1/4B3  w - - 0 1"},
            {"id":"66716", "stipulation":"#6", "position":"8/8/8/2kN4/3NKp2/5P2/P1B1P3/8  w - - 0 1"},
            {"id":"66717", "stipulation":"#6", "position":"3rk3/2b1n1P1/1N1p2RP/4pP2/8/5B2/8/1q3rBK  w - - 0 1"},
            {"id":"66718", "stipulation":"#6", "position":"r4r2/2p2pq1/pp2pk1p/5B2/1BK1Pp2/2P2P1P/P2P1Q2/8  w - - 0 1"},
            {"id":"66719", "stipulation":"#6", "position":"8/1p1B2p1/bP4P1/1p2N2p/1B1PkP1P/1p2P3/pP4N1/K7  w - - 0 1"},
            {"id":"67115", "stipulation":"#7", "position":"rn4kr/p5Bp/3N1p2/3Pp3/B5R1/PRp3P1/2b3q1/K3b3  w - - 0 1"},
            {"id":"67116", "stipulation":"#7", "position":"q4rbr/2b3N1/ppR2p1p/Nn2kp1B/4p2n/PpP1R2P/1PQ3P1/2B3K1  w - - 0 1"},
            {"id":"67117", "stipulation":"#7", "position":"1k6/2r5/pp1Q2p1/5pq1/5n2/4bB1p/PP6/1K1R3R  w - - 0 1"},
            {"id":"67119", "stipulation":"#7", "position":"8/8/K1N1p3/1p1p4/kP1p4/3P4/1PP5/8  w - - 0 1"},
            {"id":"67120", "stipulation":"#7", "position":"5r1k/5bqp/2p2N1r/2P4Q/3B4/8/8/6RK  w - - 0 1"},
            {"id":"67121", "stipulation":"#7", "position":"6bk/3K3p/7P/8/1p6/8/1P2R3/8  w - - 0 1"},
            {"id":"77527", "stipulation":"#4", "position":"8/3K1R2/4N3/3Nk3/2P5/8/8/8  w - - 0 1"},
            {"id":"77528", "stipulation":"#4", "position":"8/7B/4p3/8/6p1/1N2k1K1/7R/8  w - - 0 1"},
            {"id":"77530", "stipulation":"#4", "position":"K7/4b3/3p4/3k4/N2N4/8/4Q3/8  w - - 0 1"},
            {"id":"77531", "stipulation":"#4", "position":"4N3/8/8/KP6/5k2/6R1/5B2/1B6  w - - 0 1"},
            {"id":"190474", "stipulation":"#20", "position":"2n4k/2KB1ppp/1p3p2/p5Q1/4p1N1/Pbpr4/1Br3PR/1n1q4  w - - 0 1"},
            {"id":"191685", "stipulation":"#4", "position":"4K3/2p5/R7/3k1NP1/1Pp1pP2/1p3P2/3p4/3BB1n1  w - - 0 1"},
            {"id":"193554", "stipulation":"#4", "position":"8/2p1N3/p4p2/n1b2P2/PpkP4/1Rp1P2K/2Q1R2B/4N3  w - - 0 1"},
            {"id":"199503", "stipulation":"#4", "position":"8/1p2K3/n3pp1p/3pk1n1/Q1P5/2N1P1PP/2NP4/5q2  w - - 0 1"},
            {"id":"199531", "stipulation":"#4", "position":"5B1r/1rP4p/3PPk1b/5b1P/Qp6/4pNpP/B7/5nK1  w - - 0 1"},
            {"id":"200785", "stipulation":"#4", "position":"8/3pK3/3P1R2/1pRpN3/1B1kb1pQ/b3r1p1/2p1BnN1/8  w - - 0 1"},
            {"id":"200795", "stipulation":"#4", "position":"6N1/5p1K/3p4/3Pb2k/8/4R1BP/4P3/8  w - - 0 1"},
            {"id":"200808", "stipulation":"#4", "position":"1Kb1R2R/2p3pr/3k2N1/P2P2Pr/p3n2b/Pp2PQ2/2q3B1/4B3  w - - 0 1"},
            {"id":"200890", "stipulation":"#4", "position":"7B/8/4pN1k/2K3n1/pPpN2p1/r3p1P1/1p4B1/bQ6  w - - 0 1"},
            {"id":"200900", "stipulation":"#4", "position":"5b1r/8/2n5/2p3R1/r6k/7B/pP1Q2P1/K2n4  w - - 0 1"},
            {"id":"200912", "stipulation":"#3", "position":"1b6/8/1n2p3/qpPR4/3Pk3/3rPNP1/1N4B1/5K2  w - - 0 1"},
            {"id":"200929", "stipulation":"#5", "position":"8/1B6/2p5/n6p/4k2P/8/3PKQ2/8  w - - 0 1"},
            {"id":"200933", "stipulation":"#4", "position":"8/1Rp3p1/4K3/2kpN3/5pB1/b1B2N2/3Pn3/3r4  w - - 0 1"},
            {"id":"200935", "stipulation":"#3", "position":"8/p3R1N1/K2pPpN1/pPpk4/Rb1n1P2/4Qp2/2P1P3/4n1BB  w - - 0 1"},
            {"id":"200936", "stipulation":"#3", "position":"1Q6/p5p1/8/P1pB2B1/3k4/n1Np4/5P2/Nbn4K  w - - 0 1"},
            {"id":"200937", "stipulation":"#4", "position":"3B4/p7/P2KR2p/3P3P/1p2PP2/1Ppk4/n1Np4/3B4  w - - 0 1"},
            {"id":"200938", "stipulation":"#4", "position":"n2R4/8/1ppPkpB1/8/2P1pr2/4bN2/1P5B/1K1Q4  w - - 0 1"},
            {"id":"200939", "stipulation":"#5", "position":"K1Q2N2/3PpRn1/pP2PpN1/4pkp1/r6p/qp3BBR/b1n5/8  w - - 0 1"},
            {"id":"202712", "stipulation":"#3", "position":"8/N2K4/1b6/3k4/1PpppP2/6PP/1Q4R1/8  w - - 0 1"},
            {"id":"208403", "stipulation":"#3", "position":"3b4/3pRr2/4b1q1/3kBpp1/PPN5/1PQ1P3/2P2P2/4K3  w - - 0 1"},
            {"id":"208839", "stipulation":"#3", "position":"2n1r3/1b6/r5Rp/b2Bqk1P/RB2N3/2pP1pPP/2K1Q3/6n1  w - - 0 1"},
            {"id":"209120", "stipulation":"#5", "position":"2N3Q1/5p2/2KP4/p3p2b/n1kp2p1/p3P3/3B1p2/2N1b3  w - - 0 1"},
            {"id":"209588", "stipulation":"#4", "position":"n5Q1/6K1/8/1B2kN2/4n3/7b/8/6B1  w - - 0 1"},
            {"id":"209589", "stipulation":"#4", "position":"1b3nb1/p6q/k1P1P1p1/1pB1N1P1/pP1N1p2/3K2p1/2P1B1Q1/3n3r  w - - 0 1"},
            {"id":"214195", "stipulation":"#4", "position":"8/4p3/4K3/4P2N/p2bk3/P3p2p/7n/2NQ4  w - - 0 1"},
            {"id":"214392", "stipulation":"#3", "position":"4N2K/8/4p3/B3R3/3k4/3N2p1/p5n1/bb1B1Q2  w - - 0 1"},
            {"id":"214672", "stipulation":"#3", "position":"B5n1/nQ4p1/1Np2br1/Kpk5/3N2p1/p1p1R1B1/q1PP4/8  w - - 0 1"},
            {"id":"214674", "stipulation":"#3", "position":"8/5ppK/5k1b/3pR3/bPp1P3/6Qp/4N1P1/2r5  w - - 0 1"},
            {"id":"214875", "stipulation":"#3", "position":"5Q2/b2Bn3/3p4/r1kp1p2/5p2/P4P2/3N4/1R1KB3  w - - 0 1"},
            {"id":"214878", "stipulation":"#3", "position":"5b2/1K1p2p1/p7/2R5/1k6/1pN5/b3P3/4Q3  w - - 0 1"},
            {"id":"215054", "stipulation":"#3", "position":"8/1K2np2/n7/1Nkp3Q/3p4/P6p/3PB1b1/r7  w - - 0 1"},
            {"id":"215971", "stipulation":"#4", "position":"1B6/1B1pN2q/nr1rp1p1/1p2k2p/3pNR1P/1n2P2K/3b4/2Q5  w - - 0 1"},
            {"id":"216406", "stipulation":"#3", "position":"q3b1B1/1R1rBr2/pp2k3/4p1P1/2Rp2K1/4p3/4N3/1QN5  w - - 0 1"},
            {"id":"236568", "stipulation":"#2", "position":"3N4/8/N2p4/1p1k1p2/4qP2/1KB3P1/Q5B1/2b5  w - - 0 1"},
            {"id":"242996", "stipulation":"#2", "position":"2R4B/8/2b3Q1/3kN2p/BP6/2n1p3/2R5/2n4K  w - - 0 1"},
            {"id":"251826", "stipulation":"#2", "position":"1BNbb3/7Q/5PP1/1n1P1krR/3R1pN1/4p2P/1Kn5/1B6  w - - 0 1"},
            {"id":"252280", "stipulation":"#2", "position":"1B1RQ3/1p6/2b5/1p6/1N1k3r/2r1n3/1n1NK2p/2R5  w - - 0 1"},
            {"id":"253380", "stipulation":"#2", "position":"5R2/6Q1/pr1b1p2/Nn2kbR1/pPB5/P4P1N/4p1K1/4B3  w - - 0 1"},
            {"id":"255681", "stipulation":"#4", "position":"8/4N3/5p2/p1b2P2/PpkP4/1Rp1P2K/2Q1R2B/4N3  w - - 0 1"},
            {"id":"255682", "stipulation":"#4", "position":"2R5/3k1rpK/2RPN1pp/Pp1Pp3/P3P2q/n2Q2N1/B1P5/n5b1  w - - 0 1"},
            {"id":"255739", "stipulation":"#4", "position":"3N4/5p1K/3p4/Pn1kpPp1/2p3p1/2pPB1P1/1P2P3/8  w - - 0 1"},
            {"id":"255868", "stipulation":"#4", "position":"8/K2p1p2/3p4/n2kp1Pn/2R5/3N1P2/3N4/5Q1b  w - - 0 1"},
            {"id":"255869", "stipulation":"#4", "position":"2n3QK/p4N2/3p4/Nn1k1p1B/1P3P2/3P2P1/P1pR4/B1q1r2b  w - - 0 1"},
            {"id":"255911", "stipulation":"#4", "position":"1b6/n7/2p5/r1B1p2K/B4kP1/3Q2p1/3P4/2R5  w - - 0 1"},
            {"id":"255912", "stipulation":"#4", "position":"2Bn4/4b3/R2p1p2/2p1k3/4b3/2K1N2n/3P4/6Q1  w - - 0 1"},
            {"id":"255958", "stipulation":"#4", "position":"bb5R/2p5/2p3p1/2R1K1k1/p2nP1Bp/6pP/n5N1/7N  w - - 0 1"},
            {"id":"256268", "stipulation":"#4", "position":"5k2/1p2p2p/1n3p2/1PR4B/1B2P1R1/1P6/K1P5/8  w - - 0 1"},
            {"id":"256269", "stipulation":"#4", "position":"4br1N/5p1p/npP2b2/6Bk/2BQp2P/5N1p/8/3K4  w - - 0 1"},
            {"id":"256468", "stipulation":"#4", "position":"K2R4/pp1BpbQr/3bN1pn/2P5/1PPNkP2/q6n/4PP1B/4R3  w - - 0 1"},
            {"id":"256921", "stipulation":"#4", "position":"8/5p2/2K2b1P/3P4/1P2kBp1/2PNp1n1/1PB3P1/R7  w - - 0 1"},
            {"id":"257137", "stipulation":"#4", "position":"8/6K1/2B2p2/n2nkN2/1pb4Q/2b3p1/3R1P1R/1q6  w - - 0 1"},
            {"id":"257194", "stipulation":"#4", "position":"1q6/1n3N1p/4PnkB/Q1b1p1p1/6P1/4N3/2K1P3/8  w - - 0 1"},
            {"id":"257205", "stipulation":"#4", "position":"8/1pNp4/1K1kb1N1/1R1p1n1p/7B/8/5P2/8  w - - 0 1"},
            {"id":"257294", "stipulation":"#4", "position":"5b2/Q4Npp/2B2k2/4p3/1P5P/1K1p4/5P1N/3nR3  w - - 0 1"},
            {"id":"257406", "stipulation":"#4", "position":"8/4B3/pnB4N/Kp1ppp2/1Pk5/p2pP3/P4PQ1/3N4  w - - 0 1"},
            {"id":"257407", "stipulation":"#4", "position":"1KN5/8/2k1P3/2p3pb/1pP5/p3N1p1/5Q1P/2n5  w - - 0 1"},
            {"id":"257525", "stipulation":"#4", "position":"4N3/8/8/2pk4/8/2KB4/8/3Q4  w - - 0 1"},
            {"id":"257526", "stipulation":"#4", "position":"4k2b/5p1N/KB3P1P/4p3/1P6/8/8/8  w - - 0 1"},
            {"id":"257701", "stipulation":"#4", "position":"8/6p1/B7/7N/p2kP3/B4P2/1p1P4/bK6  w - - 0 1"},
            {"id":"257713", "stipulation":"#4", "position":"2Q5/1n1p1n1p/2b1B1pp/8/p2p2R1/5k1N/5P2/3K4  w - - 0 1"},
            {"id":"257836", "stipulation":"#4", "position":"4N3/8/8/KP6/5k2/6R1/8/1B6  w - - 0 1"},
            {"id":"257837", "stipulation":"#4", "position":"7N/3p4/3Pp3/1p2P3/1k2P3/1N6/K1P1B2R/8  w - - 0 1"},
            {"id":"257852", "stipulation":"#4", "position":"8/8/p3p3/p1p1P3/p1k2P1p/P1p1P3/N3P3/1RB2B1K  w - - 0 1"},
            {"id":"257869", "stipulation":"#4", "position":"r2n1R2/8/2p4b/1Q1p2Rp/4k2N/p4p1K/p4P2/4n3  w - - 0 1"},
            {"id":"263277", "stipulation":"#3", "position":"4B3/1p4R1/1K2P3/4P3/4Nk2/7R/5N1P/8  w - - 0 1"},
            {"id":"264255", "stipulation":"#3", "position":"4RN1b/n3B3/8/4k3/1NP1p1P1/4P2K/p7/1n6  w - - 0 1"},
            {"id":"264463", "stipulation":"#3", "position":"8/3N2n1/p7/Q7/4k1n1/2K1p2N/4B2P/8  w - - 0 1"},
            {"id":"264770", "stipulation":"#3", "position":"7r/n1R2N1p/4k1r1/1p3b2/3pN3/p2R4/4B1QB/K7  w - - 0 1"},
            {"id":"265590", "stipulation":"#3", "position":"2R5/3N1K2/1p6/1p1p2p1/pQnk2P1/P7/8/1B3N2  w - - 0 1"},
            {"id":"265970", "stipulation":"#3", "position":"b7/p3pK2/Q3N1p1/2p3P1/1N2kBP1/1p2p3/1n2B3/1n6  w - - 0 1"},
            {"id":"267364", "stipulation":"#3", "position":"2K5/1pP2pN1/1Bk1nR2/p4p2/p4P2/P7/2P5/2Q2Bbr  w - - 0 1"},
            {"id":"267366", "stipulation":"#3", "position":"7b/5nN1/3B2kp/5R1p/7P/2K1p1P1/4B3/8  w - - 0 1"},
            {"id":"267964", "stipulation":"#3", "position":"8/2n5/3B4/Q4KP1/1p4N1/5kp1/1B1bR3/5b2  w - - 0 1"},
            {"id":"267965", "stipulation":"#3", "position":"B3K1kr/5p1r/7p/6NN/8/8/8/B7  w - - 0 1"},
            {"id":"268528", "stipulation":"#3", "position":"4R2n/8/2p5/3b1Np1/Ppk3P1/1N2p3/KP2P3/4B3  w - - 0 1"},
            {"id":"268529", "stipulation":"#3", "position":"1b6/4pn2/2Bpk2r/3N1p1n/5p2/2B2N1P/6R1/1bK3Q1  w - - 0 1"},
            {"id":"268530", "stipulation":"#3", "position":"6BB/3N4/8/6p1/p3k1K1/3p4/P2P4/8  w - - 0 1"},
            {"id":"268532", "stipulation":"#3", "position":"7b/1pB2n2/8/1p3Q2/1R2p3/1PkN4/2P5/2K5  w - - 0 1"},
            {"id":"269015", "stipulation":"#3", "position":"3B4/2P3P1/3k1P2/8/3K4/8/8/8  w - - 0 1"},
            {"id":"269016", "stipulation":"#3", "position":"8/p3R1N1/K2pPpN1/pPpk4/Rb1n1P2/4Qp2/1PP1P3/4n1BB  w - - 0 1"},
            {"id":"269848", "stipulation":"#3", "position":"K3Q1N1/3Bn3/1BPp1p2/3pk1b1/3R4/1PR2P2/2PPn1P1/8  w - - 0 1"},
            {"id":"270045", "stipulation":"#3", "position":"8/1Np5/4n3/N4R1p/3k3P/n5KB/3PP3/8  w - - 0 1"},
            {"id":"270320", "stipulation":"#3", "position":"4Q3/n4ppN/3p3b/3k4/3N3R/1K1Pp3/7B/3R4  w - - 0 1"},
            {"id":"270321", "stipulation":"#3", "position":"nb3Q2/4K2p/3PN3/2p1p2r/R1N1k1P1/B1p3p1/B3P1qR/1b5n  w - - 0 1"},
            {"id":"270322", "stipulation":"#3", "position":"n7/2p5/1pP1K3/7B/pN1kp1P1/p6Q/P2pP3/2bR4  w - - 0 1"},
            {"id":"270451", "stipulation":"#3", "position":"8/3n2K1/1p4Q1/4k3/R3Np2/1P4B1/8/1b5B  w - - 0 1"},
            {"id":"270452", "stipulation":"#3", "position":"1b1n3q/2N2n2/p2r4/p2p3b/3k4/B4p2/3K4/1Q3B2  w - - 0 1"},
            {"id":"271031", "stipulation":"#3", "position":"3q4/1Q2R1B1/8/p7/P6N/1b1k4/4pP1r/2n1K2n  w - - 0 1"},
            {"id":"271103", "stipulation":"#3", "position":"8/3Np3/1RB1p3/2prP3/2N1k1P1/pP1pb2R/P1n5/3K4  w - - 0 1"},
            {"id":"321079", "stipulation":"#3", "position":"8/N2K4/1b6/1P1k4/1PpppP2/6PP/1Q4R1/8  w - - 0 1"}
          ]
        }

    };
    });

