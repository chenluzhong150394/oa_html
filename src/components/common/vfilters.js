const vfilter = {
    setSub: function (a) {
        if(a[1]){
            let b = a[0] - a[1];
            let c = (b / a[1] *100).toFixed(2);
            return c+'%';
        }else {
            return ''
        }
    },
    setSub1: function (a) {
        if(a[1]){
            var r1,r2,m,n;
            try{r1=a[0].toString().split(".")[1].length}catch(e){r1=0}
            try{r2=a[1].toString().split(".")[1].length}catch(e){r2=0}
            m=Math.pow(10,Math.max(r1,r2));
            //动态控制精度长度
            n=(r1=r2)?r1:r2;
            return ((a[0]*m-a[1]*m)/m).toFixed(n);

        }else {
            return '';
        }
    },
    getName: function (name) {
        return (name.split('_'))[0];
    },
    sq: function (val) {
        return val?val:'未授权'
    }
};
export default vfilter;
