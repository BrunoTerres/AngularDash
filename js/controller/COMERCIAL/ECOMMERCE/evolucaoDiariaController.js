app.controller('evolucaoDiariaController', function($scope, $http,$timeout,growl){
        
    if (!$scope.permissoes[9]){
        window.location = "LOGIN/login.html";
    }
    
    $scope.gototop();
    
    //==========  TRANSPEND ==========//
    $scope.transPend = {
        visaoGeral: false,
        visaoPorTempo: false
    }; 
    
    $scope.cross = false;
    $scope.esconderTable = false;

    $scope.contagemEvolucao   = '10';

    $scope.selecaoEvolucaoDiaria ={
        selectedOption: {id: '10', name: '10'},
        availableOptions: [
            {id:'10', name:'10'},
            {id:'20', name:'20'},
            {id:'50', name:'50'},
            {id:'100', name:'100'}    
         
        ]
    }; 
    
    $scope.filterContagemEvolucao  = function(data){
        $scope.contagemEvolucao   = data.id;   
    };

    //========== VARIAVEIS PARA CONTROLAR DIAS DO MES =============//
    var ano = 2018;
    var div = 4;
    var bisexto = false;

    var mes = 1; //indica o mês selecionado
        
    //========== FUNCAO PARA OCULTAR DIAS DO MES =============//
    $scope.ocultaDiasMes = function(vAno, vMes){
        $scope.d31 = true;
        $scope.d30 = true;
        $scope.d29 = true;
        var bisexto = false;
        var div = 4;
        if (vAno % div == 0){
            bisexto = true;
        }
        if (vMes == 2){
            $scope.d31 = false;
            $scope.d30 = false;
            $scope.d29 = bisexto;
        } else
        if (vMes == 4){
            $scope.d31 = false;            
        } else
        if (vMes == 6){
            $scope.d31 = false;            
        } else
        if (vMes == 9){
            $scope.d31 = false;            
        } else
        if (vMes == 11){
            $scope.d31 = false;            
        }
    };

   $("#datepicker").datepicker( {
        format: "mm-yyyy",
        startView: "months", 
        minViewMode: "months"       
    });
    
    //========== FUNÇÃO PARA PEGAR MÊS E ANO  ==========// 
    var data = new Date();      
    $scope.infoDate = {        
        'data':(data.getMonth() + 1 + '-' + data.getFullYear())
    };
    $scope.filtro = '';
    $scope.ocultaDiasMes(data.getFullYear(), data.getMonth() + 1);
    
    $scope.visEvolucaoDiaria = [];  
    //========== CAPTAR OS VENDEDORES PARA SELECT ADMIN E GERENTE ==========// 
    $scope.evolucaoDiariaGetVendedor = function(){
        $http({
            url: $scope.baseApi + 'evolucaoDiariaGetVendedor/',
            method: 'GET',             
            headers: { 
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                'Authorization': $scope.login.token 
            }      
        }).then(function(event){   
            var listVendedores = event.data.listaVendedores
            $scope.data = {
                     selectedOption: listVendedores[0],
                     availableOptions: listVendedores
            };            
            $scope.transPend.visaoGeral = false;                 
        }).catch(function(err){            
            console.log(err);
            $scope.transPend.visaoGeral = false;    
            if(err.data.error == false){
                growl.warning('<b>ATENÇÃO!</b><br>'+ err.data.msg);   
            }else{
                growl.error('<b>SERVIDOR</b><br> Erro de conexeão - ID: 27');   
            };  
        })         
    };
    
    $scope.evolucaoDiariaGetVendedor();
    
    $scope.dataSelect = function(){
        if($scope.data.selectedOption.id != '999'){
          $scope.filtroDados($scope.data.selectedOption.id);   
        }else{
          $scope.filtroDados("999");      
        } 
    };
  
    $scope.filtroDados = function(codVend){ 
        $scope.filtro = codVend;       
    };
    
    //========== POST EVOLUCAO DIARIA ==========// 
    $scope.evolucaoDiaria = function(){
        $scope.esconderTable = false;
        if($scope.filtro == ''){
            $scope.filtroDados('999')
        }
        $scope.infoDate.data = $('#date').val()  
        $scope.infoDate.codigoVendedor = $scope.filtro;  
        $scope.visEvolucaoDiaria = [];
        
        var mes = $scope.infoDate.data.substr(0, $scope.infoDate.data.indexOf("-"));
        var ano = $scope.infoDate.data.substr($scope.infoDate.data.indexOf("-") + 1, 4);
        $scope.ocultaDiasMes(ano, mes);
        $scope.infoDate.cross = $scope.cross;     
        if($scope.transPend.visaoGeral==false && $scope.transPend.visaoPorTempo==false){
            $scope.transPend.visaoGeral = true;
        $http({
            url: $scope.baseApi + 'evolucaoDiaria/',
            method: 'POST',
            data: {'evolucaoDiaria':  $scope.infoDate},
            headers: { 
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                'Authorization': $scope.login.token 
            }     
        }).then(function(event){  
            $scope.transPend.visaoGeral = false; 
            if(event.data.mensagem == true){
                growl.info('<b>AGUARDE</b><br> Vendedor não possui dados na data informada!');
            }else{
                $scope.visEvolucaoDiaria = event.data; 
                //console.log($scope.visEvolucaoDiaria);
                $scope.esconderTable = true;
            }; 
        }).catch(function(err){ 
            console.log(err);
            $scope.inforFornecedor.valida = false
            $scope.transPend.visaoGeral = false;             
            if(err.data.error == false){
                growl.warning('<b>ATENÇÃO!</b><br>'+ err.data.msg);   
            }else{
                growl.error('<b>SERVIDOR</b><br> Erro de conexão - ID: 28');    
            };                     
        })  
        }else{
            growl.info('<b>AGUARDE</b><br> Transação Pendente!');
        }      
    };

});

