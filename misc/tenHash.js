const tenHash = {
    alpha : {
        vowels : ["aeiouAEIOU",["a","e","i","o","u","A","E","I","O","U"]],
        consonants : ["bcdfghjklmnpqrstvwxyzBCDFGHJKLMNPQRSTVWXYZ",["b", "c", "d", "f", "g", "h", "j", "k", "l", "m", "n", "p", "q", "r", "s", "t", "v", "w", "x", "y", "z", "B", "C", "D", "F", "G", "H", "J", "K", "L", "M", "N", "P", "Q", "R", "S", "T", "V", "W", "X", "Y", "Z"]],
        all : [],
        isVowel : async (str) => {
            var _vowels = tenHash.alpha.vowels[0];
            if (str.length > 1) return [false,"Length exceeded"];
            else {
                if (_vowels.includes(str)) {
                    var _index = _vowels.indexOf(str);
                    return [true,`'${str}' is a vowel.`,_index];
                }
                else  return [false,`'${str}' is probably a consonant.`,null];
            }
        },
        isConsonant : async (str) => {
            if (str.length > 1) return [false,"Length exceeded"];
            else {
                var cons =  tenHash.alpha.consonants[0];
                if (cons.includes(str)){
                    var _index = cons.indexOf(str);
                    return [true,`'${str}' is a consonant.`,_index];
                }
                else  return [false,`'${str}' is probably a vowel.`, null];
            }
        }
    },
    hash : async (string) =>{
        /*var alpha = "thequickbrownfoxjumpsoverthelazydog", alphaL = "";
        alpha.split('').forEach(letter => !alphaL.includes(letter) ? alphaL += letter : "");
        var alphaC = alphaL.toUpperCase(), alpha = "";
        alpha = alphaL + alphaC;*/
        var alpha = "thequickbrownfxjmpsvlazydgTHEQUICKBROWNFXJMPSVLAZYDG";
        string = string.split('');
        var tenHashedString = "";
        string.forEach((stri,n)  => {
            console.log(alpha.indexOf(stri));
           
         });
    },
    dehash : async () => {

    }
}

exports.tenHash = tenHash;