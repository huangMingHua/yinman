function nowTerm(term, terms) {
    if (terms.length > 0) {
        let nowDate = new Date()
            /**
             * 如果当前时间在学期内显示当前学期周期
             */
        for (let [index, item] of terms.entries()) {
            let startDate = new Date(item.startDate)
            let endDate = new Date(item.endDate)
            if (nowDate.getTime() >= startDate.getTime() && nowDate.getTime() <= endDate.getTime()) {
                term = terms[index];
            }
        }
        /**
         * 如果当前时间不在学期内并且下学期存在
         */
        if (!term) {
            for (let i = 0; i < terms.length; i++) {
                if (terms[i + 1]) {
                    let startDate = new Date(terms[i + 1].startDate)
                    let endDate = new Date(terms[i].endDate)
                    if (nowDate.getTime() <= startDate.getTime() && nowDate.getTime() >= endDate.getTime()) {
                        term = terms[i + 1];
                    }
                }
            }
        }
        /**
         * 如果当前时间不在学期内并且下学期不存在
         */
        if (!term) {
            term = terms[terms.length - 1];
        }
        return term
    }
}
export default nowTerm