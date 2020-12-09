app.controller('lojasCadastroMetaController', function($scope, $http,$timeout,growl){
    
    if (!$scope.permissoes[30]){
        window.location = "LOGIN/login.html";
    }
    
    $scope.gototop();
    
    //==========  TRANSPEND ==========//
    $scope.transPend = {
        visaoGeral: false,
        visaoPorTempo: false
    };

    //========== FUNÇÃO DATA PARA PAGINAS ==========//    
    var data = new Date();
    var primeiroDia = new Date(data.getFullYear(), data.getMonth(), 1)
    var ultimoDia = new Date(data.getFullYear(), data.getMonth()+ 1, 0)

    //==========  VARIAVESI GLOBAIS ==========//
    $scope.empresaSelecao ='';
    $scope.idEditar = '';
    $scope.divCadastroApresenta = false;
    $scope.divVisualizarMetas = false;
    $scope.formApresenta = false;
    $scope.botaoVolta = false;

    $scope.editarVendedores = [];   
    $scope.infoVendedores = [];
    
    $scope.dadosCadastroMeta = {
        usuario: $scope.login.usuario,
        dataInicial: primeiroDia,
        metaAcessorios: '',
        dataFim: ultimoDia,
        codigoVendedor: '',
        metaCelulares: '',      
        metaEletros: '',
        metaGeral: '', 
        empresa: '', 
    };
    
    //==========  ESCOLHA EMPRESA - PERFIL ADM ==========//
    if($scope.login.idperfil == 48){
        $scope.selecaoEmpresa ={
            selectedOption: {id: 'EP', name: 'Empresa'},
            availableOptions: [
                {id:'EP', name:'Selecione a empresa'},               
                {id:'201', name:'Curitiba - Palladium'}, 
                {id:'202', name:'Curitiba - Jockey Plaza'},  
            ]
        };  
        
    }else
    if($scope.login.idperfil == 35){
        
        if($scope.login.usuario == 'joceli.m'){
            $scope.selecaoEmpresa ={
                selectedOption: {id: 'EP', name: 'Empresa'},
                availableOptions: [
                    {id:'EP', name:'Selecione a empresa'},
                    {id:'102', name:'Itajaí Quiosque'},  
                ]
            };
        }else
        if($scope.login.usuario == 'aline.garcia'){
            $scope.selecaoEmpresa ={
                selectedOption: {id: 'EP', name: 'Empresa'},
                availableOptions: [
                    {id:'EP', name:'Selecione a empresa'},
                    {id:'107', name:'Itajaí Loja'}, 
                ]
            }; 
        }else
        if($scope.login.usuario == 'aline.garcia'){
            $scope.selecaoEmpresa ={
                selectedOption: {id: 'EP', name: 'Empresa'},
                availableOptions: [
                    {id:'EP', name:'Selecione a empresa'},
                    {id:'106', name:'Balneário'}, 
                ]
            };  
        }else
        if($scope.login.usuario == 'anderson.luis'){
            $scope.selecaoEmpresa ={
                selectedOption: {id: 'EP', name: 'Empresa'},
                availableOptions: [
                    {id:'EP', name:'Selecione a empresa'},
                    {id:'103', name:'Joinville'}, 
                ]
            }; 
        }else
        if($scope.login.usuario == 'rodrigo.tp'){
            $scope.selecaoEmpresa ={
                selectedOption: {id: 'EP', name: 'Empresa'},
                availableOptions: [
                    {id:'EP', name:'Selecione a empresa'},
                    {id:'104', name:'Blumenau'},
                ]
            }; 
        }else
        if($scope.login.usuario == 'leonardo.cherem'){
            $scope.selecaoEmpresa ={
                selectedOption: {id: 'EP', name: 'Empresa'},
                availableOptions: [
                    {id:'EP', name:'Selecione a empresa'},
                    {id:'105', name:'São José'}
                ]
            }; 
        }else
        if($scope.login.usuario == 'priscila.colaco'){
            $scope.selecaoEmpresa ={
                selectedOption: {id: 'EP', name: 'Empresa'},
                availableOptions: [
                    {id:'EP', name:'Selecione a empresa'},
                    {id:'202', name:'Curitiba - Jockey Plaza'},   
                ]
            }; 
        }  
    }else{
        $scope.selecaoEmpresa ={
            selectedOption: {id: 'EP', name: 'Empresa'},
            availableOptions: [
            {id:'EP', name:'Selecione a empresa'},
            {id:'102', name:'Itajaí Quiosque'},
            {id:'107', name:'Itajaí Loja'},
            {id:'106', name:'Balneário'},
            {id:'103', name:'Joinville'},
            {id:'104', name:'Blumenau'}, 
            {id:'105', name:'São José'},       
            {id:'201', name:'Curitiba - Palladium'},  
            {id:'202', name:'Curitiba - Jockey Plaza'},  
            ]
        };    
    };          

    //==========  SELECT DO HTML PARA CAPTAR O ID SELECIONADO ==========//
    $scope.filterEmpresa = function(data){
        $scope.empresaSelecao = data.id;   
        if($scope.empresaSelecao == '102'){
            $scope.nameEmpresa = 'ITAJAI Quiosque';
        }else 
        if($scope.empresaSelecao == '107'){
            $scope.nameEmpresa = 'ITAJAI Loja'
        }else 
        if($scope.empresaSelecao == '106'){
            $scope.nameEmpresa = 'BALNEARIO'
        }else 
        if($scope.empresaSelecao == '103'){
            $scope.nameEmpresa = 'JOINVILLE';
        }else
        if($scope.empresaSelecao == '104'){
            $scope.nameEmpresa = 'BLUMENAU';
        }else
        if($scope.empresaSelecao == '105'){
            $scope.nameEmpresa = 'SÃO JOSÉ';
        }else
        if($scope.empresaSelecao == '201'){
            $scope.nameEmpresa = 'CURITIBA - PALLADIUM';
        }else
        if($scope.empresaSelecao == '202'){
            $scope.nameEmpresa = 'CURITIBA - JOCKEY PLAZA';
        };        
    };    

    //==========  POST PARA PESQUISA O VENDEDOR DA LOJA SELECIONADA ==========//
    $scope.metaPesquisaLoja = function(value){
        if($scope.empresaSelecao  == ''){
            growl.warning('<b>ATENÇÃO</b><br> Selecione a Loja para pesquisa'); 
        }else{    
            $scope.divCadastroApresenta = false;
            $scope.divVisualizarMetas = false;
            $scope.formApresenta = false;
            $scope.botaoVolta = false; 
            $scope.vendedoresLoja = [];   
            if($scope.isValidDate($scope.filtro.dataInicial) && $scope.isValidDate($scope.filtro.dataFim)){ 
                $scope.infoPesquisaMeta = {
                    dataInicial: $scope.filtro.dataInicial,
                    dataFim: $scope.filtro.dataFim,
                    empresa:$scope.empresaSelecao,   
                    id: $scope.idEditar,                 
                    value: value,                                             
                };             

                if($scope.transPend.visaoGeral==false && $scope.transPend.visaoPorTempo==false){
                    $scope.transPend.visaoGeral = true;
                    $http({
                        url: $scope.baseApi + 'metaPesquisaLoja/',
                        method: 'POST',
                        data: {'metaPesquisaLoja': $scope.infoPesquisaMeta},
                        headers: { 
                            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                            'Authorization': $scope.login.token 
                        }      
                    }).then(function(event){   
                        $scope.transPend.visaoGeral = false; 
                        if(event.data.metas.error == true && value == 'N'){                               
                            growl.warning('<b>ATENÇÃO</b><br> Não existe meta cadastrada na empresa ' + $scope.empresaSelecao);    
                            $scope.vendedoresLoja = event.data.metas.vendedores;                 
                            $scope.divCadastroApresenta  = true; 
                            $scope.divVisualizarMetas = false;
                        }else
                        if(value == 'C'){                           
                            $scope.vendedoresLoja = event.data.metas.vendedores;                 
                            $scope.divCadastroApresenta  = true; 
                            $scope.divVisualizarMetas = false;
                            $scope.botaoVolta = true; 
                        }                      
                        else
                        if(value == 'E'){    
                            $scope.editarVendedores = [];  
                            $scope.editarVendedores = event.data.metas.metaVendedor;                           
                            //========== CRIAR DATA PARA CALENDARIO HTML ==========//                      
                            var dateInicio = $scope.editarVendedores.dataInicial.split('-');
                            var dateFim =  $scope.editarVendedores.dataFim.split('-');    
                            dateInicio = new Date(parseInt(dateInicio[2]), parseInt(dateInicio[1]-1), parseInt(dateInicio[0]));          
                            dateFim = new Date(parseInt(dateFim[2]), parseInt(dateFim[1]-1), parseInt(dateFim[0])); 
                            $scope.editarVendedores.dataInicial = dateInicio;
                            $scope.editarVendedores.dataFim = dateFim;                          
                            $scope.divCadastroApresenta  = false; 
                            $scope.divVisualizarMetas = false;
                            $('#modalEditar').trigger('click'); 
                        }else{
                            $scope.infoVendedores = [];
                            $scope.infoVendedores = event.data.metas.metaVendedor;                           
                            $scope.divVisualizarMetas = true;
                            $scope.divCadastroApresenta  = false;
                        };      
                    }).catch(function(err){
                        console.log(err)        
                        $scope.transPend.visaoGeral = false;                         
                        if(err.data.error == false){
                            growl.warning('<b>ATENÇÃO!</b><br>'+ err.data.msg); 
                        }else{
                            growl.error('<b>SERVIDOR</b><br> Erro de conexão - ID: 66'); 
                        };                   
                    })  
                }else{
                    growl.info('<b>AGUARDE</b><br> Transação Pendente!');
                };
            }else{
                growl.warning('<b>ATENÇÃO</b><br> Data(s) Inválidas(s)');              
            };
        };              
    };

    //========== POST PARA CADASTRAR A META DO VENDEDOR ==========//
    $scope.cadastroMetaLoja = function(){
        if($scope.dadosCadastroMeta.metaGeral == 0){
            growl.warning('<b>ATENÇÃO</b><br> Meta Geral não informada ou está igual a zero'); 
        }else{
            $scope.dadosCadastroMeta.empresa =  $scope.empresaSelecao; 
            if($scope.transPend.visaoGeral==false && $scope.transPend.visaoPorTempo==false){
                $scope.transPend.visaoGeral = true;
                $http({
                    url: $scope.baseApi + 'cadastroMetaLoja/',
                    method: 'POST',
                    data: {'cadastroMetaLoja': $scope.dadosCadastroMeta},
                    headers: { 
                        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                        'Authorization': $scope.login.token 
                    }      
                }).then(function(event){   
                    $scope.transPend.visaoGeral = false;                   
                    if(event.status == 200){
                        growl.success('<b>SUCESSO</b><br> Meta cadastrada');  
                        $scope.dadosCadastroMeta = {
                            usuario: $scope.login.usuario,
                            dataInicial: primeiroDia,
                            metaAcessorios: '',
                            dataFim: ultimoDia,
                            codigoVendedor: '',
                            metaCelulares: '',      
                            metaEletros: '',
                            metaGeral: '', 
                            empresa: '', 
                        };
                        $scope.metaPesquisaLoja('');
                    }else{
                        growl.warning('<b>ATENÇÃO</b><br> Meta não cadastrada, tente novamente');  
                    }                 
                }).catch(function(err){       
                    console.log(err);        
                    $scope.transPend.visaoGeral = false;                     
                    if(err.data.error == false){
                        growl.warning('<b>ATENÇÃO!</b><br>'+ err.data.msg); 
                    }else{
                        growl.error('<b>SERVIDOR</b><br> Erro de conexão - ID: 67'); 
                    };                     
                })  
            }else{
                growl.info('<b>AGUARDE</b><br> Transação Pendente!');
            };
        };  
    };

    //========== CHAMADA DE MODAL ==========//
    $scope.modalEditarMetaLoja = function(id){
        $scope.idEditar = id;
        $scope.metaPesquisaLoja('E');
    };

    //========== POST PARA EDITAR CADASTRA META VENDEDOR ==========//
    $scope.editarMetaLoja = function(){
        $scope.editarVendedores.usuario = $scope.login.usuario;     
        if($scope.transPend.visaoGeral==false && $scope.transPend.visaoPorTempo==false){
            $scope.transPend.visaoGeral = true;
            $http({
                url: $scope.baseApi + 'editarMetaLoja/',
                method: 'POST',
                data: {'editarMetaLoja': $scope.editarVendedores},
                headers: { 
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                    'Authorization': $scope.login.token 
                }      
            }).then(function(event){   
                $scope.transPend.visaoGeral = false;                   
                if(event.status == 200){
                    growl.success('<b>SUCESSO</b><br> Meta alterada');  
                    $scope.editarVendedores = []; 
                    $('#myModalEditar').modal('hide');
                    $scope.metaPesquisaLoja('');
                }else{
                    growl.warning('<b>ATENÇÃO</b><br> Meta não alterada, tente novamente');  
                }                 
            }).catch(function(err){       
                console.log(err);        
                $scope.transPend.visaoGeral = false;               
                if(err.data.error == false){
                    growl.warning('<b>ATENÇÃO!</b><br>'+ err.data.msg); 
                }else{
                    growl.error('<b>SERVIDOR</b><br> Erro de conexão - ID: 68'); 
                };                     
            })  
        }else{
            growl.info('<b>AGUARDE</b><br> Transação Pendente!');
        };
    };

    $scope.divCadastro = function(value){
        if(value == 1){       
            $scope.metaPesquisaLoja('C')       
        }else
        if(value == 2){
            $scope.divCadastroApresenta = false;
            $scope.divVisualizarMetas = true;
            $scope.botaoVolta = false;
        };
    };
    
    //==========  FUNÇÃO PARA APARECER DIV NA ESCOLHA DO VENDEDOR ==========//
    $scope.apresentaDiv = function(value){
        if(typeof value === 'undefined'){  
            growl.warning('<b>ATENÇÃO</b><br> Selecione  Vendedor(a) para pesquisa');         
            $scope.formApresenta = false;
        }else{
            $scope.formApresenta = true;            
            $scope.dadosCadastroMeta.codigoVendedor = value; 
            
        };
    };

});

