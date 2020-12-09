app.controller('ocBacklogController', function($scope, $http,$timeout,growl){

    if (!$scope.permissoes[34]){
        window.location = "LOGIN/login.html";
    };      
       
    $scope.gototop();
    
    //==========  TRANSPEND ==========//
    $scope.transPend = {
        visaoGeral: false,
        visaoPorTempo: false
    };

    //========== FUNÇÃO PARA CRIAÇÃO DO INPUT DATE ==========//
    var data = new Date();
    var primeiroDia = new Date(data.getFullYear(), data.getMonth(), 1)
    var ultimoDia = new Date(data.getFullYear(), data.getMonth()+ 1, 0)

    $scope.divVisualizarOc = false;
    $scope.divVisualizarOcProd = false;
  
    $scope.filterStatus = function(data){
        $scope.statusBacklog = data.id;       
    }; 
    
  
    $scope.filterEditar= function(data){    
        $scope.editarBacklog = data.id;       
    };  
 
    //========== POST PARA PESQUISA OC CLIENTE ==========// 
    $scope.pesquisaOcCLienteAtacado = function(){
        $scope.divVisualizarOc = false;
        $scope.divVisualizarOcProd = false;
        if($scope.isValidDate($scope.filtro.dataInicial) && $scope.isValidDate($scope.filtro.dataFim)){
           if($scope.transPend.visaoGeral==false && $scope.transPend.visaoPorTempo==false){
                $scope.transPend.visaoGeral = true;  
                $scope.divVisualizarOc = false;              
                $scope.filtro.id = 'x'; 
            $http({
                url: $scope.baseApi + 'pesquisaOcCLienteAtacado/',
                method: 'POST',
                data: {'pesquisaOcCLienteAtacado': $scope.filtro},
                headers: { 
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                    'Authorization': $scope.login.token 
                }       
            }).then(function(event){
                $scope.transPend.visaoGeral = false;     
                var oc = event.data.ordemDeCompra;                  
                if(oc.error == true){
                    growl.warning('<b>ATENÇÃO</b><br> Não existe ordem de compra cadastrada')
                    $scope.divVisualizarOc = false;                        
                }else{
                    $scope.divVisualizarOc = true;                                   
                    $scope.oc = oc.data;   
                };    
            }).catch(function(err){   
                console.log(err);        
                $scope.transPend.visaoGeral = false;              
                if(err.data.error == false){
                    growl.warning('<b>ATENÇÃO!</b><br>'+ err.data.msg);    
                }else{
                    growl.error('<b>SERVIDOR</b><br> Erro de conexão - ID: 80');          
                };                
            })  
            }else{
                growl.info('<b>AGUARDE</b><br>Transação Pendente!');
            }; 
        }else {
            growl.warning('<b>ATENÇÃO</b><br>Data(s) Inválida(s)!');     
        };
    }; 

    //========== POST PARA PESQUISA PRODUTOS DA OC - BACKLOG ==========// 
    $scope.ocBacklogAtacado = function(value,numeroOC,nomeCliente,quantidade,produto){
        if($scope.transPend.visaoGeral==false && $scope.transPend.visaoPorTempo==false){
            $scope.transPend.visaoGeral = true; 
            $scope.infoBackLog = {
                nomeCliente: nomeCliente,
                quantidade: quantidade,
                numeroOC: numeroOC,
                produto: produto,
                value: value,
                dataInicial: $scope.filtro.dataInicial,
                dataFim: $scope.filtro.dataFim    
            }; 
            if(value == ''){
                $scope.backlogInfo = {
                    nomeCliente: nomeCliente,
                    quantidade: quantidade,
                    numeroOC: numeroOC,                    
                    value: value                  
                };
            };           
            $http({
                url: $scope.baseApi + 'ocBacklogAtacado/',
                method: 'POST',
                data: {'ocBacklogAtacado': $scope.infoBackLog},
                headers: { 
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                    'Authorization': $scope.login.token 
                }        
            }).then(function(event){    
                $scope.transPend.visaoGeral = false;   
                var ocProd = event.data;
                if(value == 'E'){
                    ocProd.infoBacklog.dataInicial = $scope.convertDateJavaScript(ocProd.infoBacklog.dataInicial,'I');  
                    ocProd.infoBacklog.dataFim = $scope.convertDateJavaScript(ocProd.infoBacklog.dataFim,'I');   
                
                    if(ocProd.infoBacklog.status != 'C'){
                        $scope.selecaoEditar ={
                            selectedOption: {id: ocProd.infoBacklog.status, name: ocProd.infoBacklog.descricaoStatus},
                            availableOptions: [                            
                               {id:'A', name:'Atendimento Parcial'},
                               {id:'S', name:'Sem Previsão'}         
                            ]
                        };  
                    }                
                    $scope.editarBL = ocProd.infoBacklog;  
                    $scope.editarBL.usuario = $scope.login.usuario;                 
                    $('#modalEditarBC').trigger('click');                  
                }else{
                    if(ocProd.error == true){
                        growl.warning('<b>ATENÇÃO</b><br> Não existe produto cadastrado na ordem de compra');  
                    }else{
                        $scope.divVisualizarOcProd = true;
                        $scope.divVisualizarOc = false;
                        $scope.ocProd = ocProd.dados;   
                        console.log($scope.ocProd )               
                    };  
                };
                                                  
            }).catch(function(err){   
                console.log(err);        
                $scope.transPend.visaoGeral = false;              
                if(err.data.error == false){
                    growl.warning('<b>ATENÇÃO!</b><br>'+ err.data.msg);    
                }else{
                    growl.error('<b>SERVIDOR</b><br> Erro de conexão - ID: 81');         
                };                    
            })  
        }else{
            growl.info('<b>AGUARDE</b><br>Transação Pendente!');
        };
    };

    //========== CHAMADA MODAL PARA CADASTRO BACKLOGS ==========// 
    $scope.modalCadastrarOcBL = function(id, produto,status, quantidadeNP, quantidadeBC,descricaoStatus){
        $scope.selecaoStatus ={
            selectedOption: {id: status, name: descricaoStatus},
            availableOptions: [
               {id: status, name:descricaoStatus},
               {id:'A', name:'Atendimento Parcial'},
               {id:'S', name:'Sem Previsão'}         
            ]
        }; 

        for(var i = 0; i < $scope.selecaoStatus.availableOptions.length; i++){
            if($scope.selecaoStatus.availableOptions[i].id == status){
                $scope.selecaoStatus.availableOptions.splice(i, 1);
            };  
        };

        $scope.infoCadastro = {
            usuario: $scope.login.usuario,
            quantidadeNP: quantidadeNP,
            quantidadeBC: quantidadeBC,
            dataInicial: primeiroDia,
            dataFim: ultimoDia,
            produto: produto,           
            status:status,
            id:id
        }; 
        $('#modalCadastrarBC').trigger('click');         
    };

    //========== VALIDACAO STATUS ==========// 
    $scope.infoCadastroBacklogAtacado = function(){
        if($scope.infoCadastro.status != 'C'){   
            if($scope.statusBacklog == undefined || $scope.statusBacklog == '' ){
                $scope.statusBacklog = 'A'
            };
            $scope.infoCadastro.status =  $scope.statusBacklog;         
            if($scope.infoCadastro.status === undefined || $scope.infoCadastro.status === null || $scope.infoCadastro.status === 'EP'){
                growl.warning('<b>ATENÇÃO</b><br> Selecione um Status');  
            }else{
                $scope.cadastroBacklogAtacado();
            }
        }else{
            $scope.cadastroBacklogAtacado();
        };       
    };

    //========== POST P/ CADASTRAR PREVISAO PF, AGENDAMENTO E STATUS  ==========// 
    $scope.cadastroBacklogAtacado = function(){
        if($scope.transPend.visaoGeral==false && $scope.transPend.visaoPorTempo==false){
            $scope.transPend.visaoGeral = true;                       
            $http({
                url: $scope.baseApi + 'cadastroBacklogAtacado/',
                method: 'POST',
                data: {'cadastroBacklogAtacado': $scope.infoCadastro},
                headers: { 
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                    'Authorization': $scope.login.token 
                }       
            }).then(function(event){    
                $scope.transPend.visaoGeral = false;   
                if(event.status == 200){                           
                    growl.success('<b>SUCESSO</b><br>Status cadastrado!');
                    $scope.statusBacklog = '';
                    $scope.ocBacklogAtacado('', $scope.backlogInfo.numeroOC ,$scope.backlogInfo.quantidade,'');                    
                    $('#myModalCadastrarBC').modal('hide');
                }else{
                    growl.error('<b>ERROR</b><br> Status não cadastrado, tente novamente!');
                }                                           
            }).catch(function(err){   
                console.log(err);        
                $scope.transPend.visaoGeral = false;                 
                if(err.data.error == false){
                    growl.warning('<b>ATENÇÃO!</b><br>'+ err.data.msg);    
                }else{
                    growl.error('<b>SERVIDOR</b><br> Erro de conexão - ID: 82');         
                };                     
            })  
        }else{
            growl.info('<b>AGUARDE</b><br>Transação Pendente!');
        };
    };

    //========== POST P/ EDITAR PREVISAO PF, AGENDAMENTO E STATUS  ==========// 
    $scope.editarCadastroBacklogAtacado = function(){
        if($scope.editarBL.descricaoStatus == 'Concluído'){
            $scope.editarBL.status = 'C'
        }else{            
            $scope.editarBL.status =  $scope.editarBacklog;  
        };            
  
        if($scope.editarBL.status == undefined && $scope.editarBL.descricaoStatus == 'Atendimento Parcial' || $scope.editarBL.status == '' && $scope.editarBL.descricaoStatus == 'Atendimento Parcial'){
            $scope.editarBL.status = 'A';
           
        }else  if($scope.editarBL.status == undefined && $scope.editarBL.descricaoStatus == 'Sem Previsão' || $scope.editarBL.status == '' && $scope.editarBL.descricaoStatus == 'Sem Previsão'){
            $scope.editarBL.status = 'S';     
           
        }
              
        if($scope.transPend.visaoGeral==false && $scope.transPend.visaoPorTempo==false){
            $scope.transPend.visaoGeral = true;                       
            $http({
                url: $scope.baseApi + 'editarCadastroBacklogAtacado/',
                method: 'POST',
                data: {'editarCadastroBacklogAtacado': $scope.editarBL},
                headers: { 
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                    'Authorization': $scope.login.token 
                }      
            }).then(function(event){    
                $scope.transPend.visaoGeral = false;   
                if(event.status == 200){                           
                    growl.success('<b>SUCESSO</b><br>Status editado cadastrado!');                    
                    $scope.editarBacklog =''
                    $scope.ocBacklogAtacado('', $scope.backlogInfo.numeroOC ,$scope.backlogInfo.quantidade,'');                    
                    $('#myModalEditarBC').modal('hide');
                }else{
                    growl.error('<b>ERROR</b><br> Status não editado, tente novamente!');
                }                                           
            }).catch(function(err){   
                console.log(err);        
                $scope.transPend.visaoGeral = false;                 
                if(err.data.error == false){
                    growl.warning('<b>ATENÇÃO!</b><br>'+ err.data.msg);    
                }else{
                    growl.error('<b>SERVIDOR</b><br> Erro de conexão - ID: 83');      
                };                    
            })  
        }else{
            growl.info('<b>AGUARDE</b><br>Transação Pendente!');
        };
            
    };
  
    $scope.menus = function(value){
        if(value == 1){
            $scope.divVisualizarOcProd = false;
            $scope.divVisualizarOc = true;
        };        
    };

});

