#!/usr/bin/perl
use strict;
use warnings;
                 
my $file = $ARGV[0] or die "Need to get CSV file on the command line\n";
 
my $sum = 0;
open(my $data, '<', $file) or die "Could not open '$file' $!\n";
open(JSON, '>', "$file.json") or die "Could not open JSON file for writing\n";

print JSON "[\n";
while (my $line = <$data>) {
  chomp $line;
 
  my ($id, $author, $book, $x, $year, $y, $stip, $fen) = split ";" , $line;

  next unless $stip =~ /^"#/;
  $fen =~ s/"//g;
  $fen .= "  w - - 0 1";

  print JSON '{"id":' . $id . ', "author": ' . $author . ', "stipulation":'. $stip . ', "fen":"' . $fen . '"},' . "\n";
}

print JSON "]\n";


