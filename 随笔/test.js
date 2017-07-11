(function(){
    //common check
    function checkNum(num) {
        var preCheckedNum = num - 0;
        if(typeof preCheckedNum !== number ){
            console.log('请输入数字')
            return false;
        }else{
            return preCheckedNum;
        }
    }


    //1.判断质数，返回true/false
    function isPrime(num) {
        var PrimeFlag = false;
        var preCheckedNum = checkNum(num);

        if(!preCheckedNum){
            return false;
        }

        if(preCheckedNum == 0 || preCheckedNum == 1 ){
            return true;
        }
        for(var i = 2 ;i < preCheckedNum; i++){
            if(preCheckedNum % i === 0){
                PrimeFlag = true;
                return PrimeFlag;
            }
        }

        return PrimeFlag;
    }



    //2.阶乘
    function factorial(num) {
        var result = 1;
        var preCheckedNum = checkNum(num);

        if(!preCheckedNum){
            return false;
        }

        for(var i = 1;i <= preCheckedNum;i++){
            result = result * i;
        }
        
        return result;
    }

    //4.判断是否排序
    function isSorted(arr) {
        //判断是否数组 略
        var newArr = arr.sort();
        var sortFlag = true;

        for(let [k,i] of newArr){
            if(!k == arr[i]){
                sortFlag = flase;
                return sortFlag;
            }
        }

        return sortFlag;
    }


    //Intermediate
}());